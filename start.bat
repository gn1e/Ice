@echo off
:start
node index.js
echo .
echo Backend has crashed, restarting.
echo .
goto start