call bin\ffmpeg -i "product_video(1).mp4" -c:v libx264 -movflags faststart -s 640x360 -g 30 -r 30 -t 20 -x264-params level=30:bframes=0:weightp=0:cabac=1:ref=3:vbv-maxrate=768:vbv-bufsize=2000:analyse=all:me=umh:no-fast-pskip=1:subq=6:8x8dct=0:trellis=0 product_video.mp4