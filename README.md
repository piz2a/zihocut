# ZihoCut
Drag-and-drop YouTube links and cut the videos instantly!<br>
[Download for Windows/Mac](https://github.com/piz2a/zihocut/releases)

## Manual
<img src="https://github.com/piz2a/zihocut/assets/43025513/3294c5d3-bbaf-4ff6-b443-6bb15f1907f5" width="500px">

- You can drag-and-drop YouTube video links or click "Paste URL" button to download videos.

<br>

<img src="https://github.com/piz2a/zihocut/assets/43025513/3474f7aa-579a-4f28-bd9f-de506854a23d" width="500px">

- Once downloaded, You can adjust the interval to trim in the video and add it to 'interval list.'<br>
You can also add multiple intervals to the interval list. It means, you can trim multiple intervals each in one video.

<br>

<img src="https://github.com/piz2a/zihocut/assets/43025513/108dd471-1b74-421c-82c1-5a1c0d045e16" width="500px">

- You can edit or delete intervals in 'interval list.'<br>
If you click "Export" button, this instantly trim videos to multiple intervals and export them.


## For Developers

Made with React & Electron.

### How to build the project
Download assets.zip [in releases](https://github.com/piz2a/zihocut/releases) and unzip it in the project directory.
- For Windows:
  1. Delete directory ```(Project directory)/assets/python/darwin```.
  2. Run the following command in the project directory:
```sh
npm i
npm run build:win
```
- For macOS:
  1. Delete directory ```(Project directory)/assets/python/win32```.
  2. Run the following command in the project directory:
```sh
npm i
npm run build:osx
```
