@echo off
echo Generando Plantilla Arquetipo Maven de Donaciones...
cd Donaciones
..\..\mvnw archetype:create-from-project -DinteractiveMode=false
echo.
echo Arquetipo generado exitosamente en Donaciones\target\generated-sources\archetype
echo Para instalar el arquetipo en tu repositorio local, corre:
echo cd Donaciones\target\generated-sources\archetype ^&^& ..\..\..\..\mvnw install
pause
