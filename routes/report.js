const express = require("express");
const app = express.Router();
const { verifyToken } = require("../token/verifytoken.js");
const User = require("../model/user.js");
const Profiles = require("../model/profiles.js");
const { Client, Intents, TextChannel } = require('discord.js');
const log = require("../utils/logger.js");
require("dotenv").config();


app.post("/fortnite/api/game/v2/toxicity/account/:unsafeReporter/report/:reportedPlayer", verifyToken, async (req, res) => {
    if (process.env.report === "true") {
        try {
            const reporter = req.user.accountId;
            const reportedPlayer = req.params.reportedPlayer;

            log.backend(`Attempting to retrieve data for reporter accountId: ${reporter}`);
            let reporterData = await User.findOne({ accountId: reporter }).lean();
            if (!reporterData) log.warning(`No data found for reporter accountId: ${reporter}, proceeding with limited info`);

            log.backend(`Retrieving data for reported player accountId: ${reportedPlayer}`);
            let reportedPlayerData = await User.findOne({ accountId: reportedPlayer }).lean();
            let reportedPlayerDataProfile = await Profiles.findOne({ accountId: reportedPlayer }).lean();

            if (!reportedPlayerData) {
                log.error(`Reported player with accountId: ${reportedPlayer} not found in the database`);
                return res.status(404).send({ "error": "Player not found" });
            }

            const rsn = req.body.reason || 'No reason provided';
            const dts = req.body.details || 'No details provided';
            const playerAlreadyReported = reportedPlayerDataProfile?.profiles?.totalReports ? 'Yes' : 'No';

            log.debug(`Player report status for accountId ${reportedPlayer}: Already reported? ${playerAlreadyReported}`);

            const client = new Client({
                intents: [
                    Intents.FLAGS.GUILDS,
                    Intents.FLAGS.GUILD_MESSAGES,
                    Intents.FLAGS.GUILD_MEMBERS,
                    Intents.FLAGS.DIRECT_MESSAGES,
                    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
                ]
            });

            await Profiles.findOneAndUpdate(
                { accountId: reportedPlayer },
                { $inc: { 'profiles.totalReports': 1 } },
                { new: true, upsert: true }
            ).then((updatedProfile) => {
                log.backend(`Updated total reports for accountId ${reportedPlayer}: ${updatedProfile.profiles.totalReports} reports`);
            }).catch((err) => {
                log.error(`Database error updating totalReports for accountId ${reportedPlayer}:`, err);
                return res.status(500).send({ "error": "Database update error" });
            });

            await new Promise((resolve, reject) => {
                client.once('ready', async () => {
                    try {
                        const payload = {
                            embeds: [{
                                title: 'New Report!',
                                description: `A user has been reported by ${reporterData?.username || "Unknown"}.`,
                                color: 0xFFA500,
                                fields: [
                                    { name: "Player reported:", value: reportedPlayerData.username, inline: true },
                                    { name: "Reason report:", value: rsn, inline: true },
                                    { name: "Extra details", value: dts, inline: true }
                                ]
                            }]
                        };

                        const reportChannel = await client.channels.fetch(process.env.REPORTCHANNEL);
                        if (reportChannel instanceof TextChannel) {
                            log.discord(`Sending report embed to Discord channel with ID: ${reportChannel.id}`);
                            await reportChannel.send({ embeds: [payload.embeds[0]] });
                            log.discord(`Report message sent successfully`);
                        } else {
                            log.warning(`Report channel with ID: ${process.env.REPORTCHANNEL} not found or invalid`);
                        }

                        resolve();
                    } catch (error) {
                        log.error(`Error during message send process in Discord:`, error);
                        reject(error);
                    }
                });

                client.login(process.env.DCTOKEN).catch((err) => {
                    log.error(`Discord client login failed for bot token:`, err);
                    reject(err);
                });
            });

            return res.status(200).send({ "success": true });
        } catch (error) {
            log.error(`Unexpected server error:`, error);
            return res.status(500).send({ "error": "An internal server error has occurred" });
        }
    } else {
        log.warning(`Report endpoint hit, but reporting feature is disabled in environment configuration.`);
        return res.status(403).send({ "error": "Reporting is disabled" });
    }
});

module.exports = app;
