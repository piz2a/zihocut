import youtube_dl_hehe as youtube_dl
import sys

ydl_opts = {
    'format': "bestvideo[height<=480][ext=mp4]",
    'outtmpl': "%(id)s.%(ext)s"
}

with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download(sys.argv[1:])

print("DOWNLOAD COMPLETE")
