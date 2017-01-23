rem @echo off
setlocal EnableDelayedExpansion
set files= 
for /r %%F in (*.png) do set files=!files! %%~nxF

echo %files%
rem @echo on 
rem echo %files%
python pack.py %files% -o out.png -jo out.json -jso out.js -co out.css -mw 4096 -mh 4096

rem convert -size 1114x545 xc:none arrow.png -geometry +0+0 -composite arrow_blur.png -geometry +316+0 -composite out.png