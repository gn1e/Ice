@echo off
:start
node fn/index.js
echo .
echo Backend has crashed, restarting.
echo .
goto start