set MIN_JS=%cd%/./tools/compiler.jar
set SRC_DIR=%cd%/js/

set HG_DIR=%1
echo %HG_DIR%
set OUT_DIR=%cd%/%HG_DIR%

set corejs=%SRC_DIR%/core_function.js
set animjs=%SRC_DIR%/anim.js
set configjs=%SRC_DIR%/config.js
set setupanimjs=%HG_DIR%/js/SetupAnim.js
set videojs=%SRC_DIR%/video_player.js
set trackingjs=%SRC_DIR%/tracking.js
set mainjs=%SRC_DIR%/main_function.js


python mergeFile.py %animjs% %corejs% %configjs% %videojs% %trackingjs% %mainjs% -o %cd%/main_src.js
python mergeFile.py %setupanimjs% -o %OUT_DIR%/config_src.js


@echo off
setlocal EnableDelayedExpansion
set maxbytesize=100000
set fileneed=

set datapath=%cd%/%HG_DIR%/data
set datastr=%HG_DIR%/data/

for /R %datapath% %%A in (*.png *.jpg) do (
	rem set size=%tmp1%
	rem echo %tmp1%
	IF %%~zA LSS %maxbytesize% (
		set fileneed=!fileneed! %%~nA%%~xA
		echo %%~nA
	)
)
echo %fileneed%
python convertBase64.py %fileneed% -ip %datapath% -o %datapath%/out.js -str %datastr%
