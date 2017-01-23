rem @echo off
setlocal disableDelayedExpansion
set "files=."
for /r %%F in (*) do (
  setlocal enableDelayedExpansion
  for /f "delims=" %%A in ("!files!") do (
    endlocal
    set "files=%%A "%%F"
  )
)
(set files=%files:~2%)
echo %files%
rem call pack.py -o out.png -jo out.json -jso out.js -co out.css -mw 2048 -mh 2048 