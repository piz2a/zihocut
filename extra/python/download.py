import youtube_dl
import sys

ydl_opts = {
    'format': "bestvideo[height<=480][ext=mp4][vcodec!*=av01]",
    'outtmpl': f"{sys.argv[2]}/%(id)s.%(ext)s"
}
url = sys.argv[1]

with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    info_dict = ydl.extract_info(url, download=True)
    video_title = info_dict.get('title', None)
    print(f'VIDEO_TITLE={video_title}')
    # ydl.download([url])
