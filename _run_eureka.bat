@echo off
set BASE=%~dp0
echo Iniciando Eureka Server (8761)...
java -jar "%BASE%EurekaServer\target\eureka-server-0.0.1-SNAPSHOT.jar"
pause
