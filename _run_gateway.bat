@echo off
cd /d "%~dp0Central"
echo Iniciando Gateway Central (8080)...
java -jar target\central-gateway-0.0.1-SNAPSHOT.jar
pause
