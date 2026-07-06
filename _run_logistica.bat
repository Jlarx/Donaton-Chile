@echo off
cd /d "%~dp0Logistica"
echo Iniciando Logistica (8082)...
java -jar target\logistica-service-0.0.1-SNAPSHOT.jar
pause
