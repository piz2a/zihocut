import sys

if sys.argv[1] == 'download':
    import youtube_dl

    ydl_opts = {
        'format': "bestvideo[height<=480][ext=mp4][vcodec!*=av01]",
        'outtmpl': f"{sys.argv[3]}/%(id)s.%(ext)s"
    }
    url = sys.argv[2]

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=True)
        video_title = info_dict.get('title', None)
        print(f'VIDEO_TITLE={video_title}')

elif sys.argv[1] == 'export':
    from moviepy.editor import VideoFileClip

    videoId = sys.argv[2]
    videoPath = sys.argv[3]
    exportVideoPath = sys.argv[4]
    videoFileClip = VideoFileClip(f"{videoPath}/{videoId}.mp4")

    for i, arg in enumerate(sys.argv[5:]):
        interval = list(map(float, arg.split('-')))
        targetPath = f"{exportVideoPath}/{videoId}_({interval[0]}-{interval[1]})_{i+1}.mp4"
        videoFileClip.subclip(interval[0], interval[1]).write_videofile(targetPath, fps=24)

    videoFileClip.reader.close()
