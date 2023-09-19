---
date: 2023-09-17
title: Custom FFXI Looped Music Tutorial (2023)
weight: 10
tags:
  - Final Fantasy XI
  - Music Production
  - BGW Files
---
Don't worry. I understand this might be one of the most unpopular blog posts of 2023. I hope you know not the plight of researching a detailed niche on the internet, having that search result in a mere handful of cobwebbed post on long forgotten forums, then having to piece together these broken hieroglyphs of information into a rough translation of what it means to do what they did in 2006, then assess how you might do the same but in 2023.

## Welcome to My Mordion Gaol
This was my challenge when producing music for the HorizonXI FFXI Private Server.[^1] We sourced [^2] and produced a bunch of remakes for old tracks but we were just renaming the extensions for our .WAV files to FFXI's proprietary .BGW format. This works but has some issues:

1. Tracks will not repeat cleanly using this method. For tracks that needs this (90% of FFXI's OST) this is quite jarring.
2. The file sizes are huge, 10x most compressed music formats. This is a weighty problem for a game that needs to be downloaded.

[^1]: Check it out! Its a swell time even for those without nostalgic memories. [HorizonXI](https://horizonxi.com)
[^2]: Lots of love to Tweex for providing his excellent selection of tracks from the original OST. [Tweex FFXI Tracks](https://www.youtube.com/playlist?app=desktop&list=PLZxq4YJUCc04H1b9HHd5n4M2XRReZRmsR)

I was unhappy with this and remembered from my distant past as a FFXI gamer in 2005 that custom, cleanly looping music was possible. I just had no idea how. 

Now, after weeks of searching; trials and errors; hefty sighs, and belated nods of success, I do! Considering the work needed to understand this, I think it's worth consolidating this information to save he time and sanity of anyone else who has need to walk this path. 

## The Process
The process is simple. 
1. Prepare your files as .WAV files, 
2. Identify your desired looping point in the music using samples (not time!)
3. Convert files using XiMC (an ancient file conversion tool made specifically for FFXI in 2005 with no known alternative.)
4. Replace the in game music with your files.

Actually, it's riddled with little issues and problems so here the details needed for each step.

### 1. Prepare your files
#### Convert files to WAV
FFXI will only accept .WAV files directly. I've had good results with 16bit 44.1k encoded files but this might work with other settings. The XiMC file processing program we will need to use to convert files fully for use in FFXI uses .WAV files. Ergo: any music you want to use needs to be in the .WAV format at some point so lets do it now.

I won't get into the nuances of codecs, sound quality, and mastering techniques for various Codecs. If you know, you know, and if you don't then you just want to get whatever music you like into the game so lets not spend our time on this.

To convert you music files to .WAV, there are plenty of websites that will do this quickly and easily. Here's [one](https://audio.online-convert.com/convert-to-wav), and [another](https://www.freeconvert.com/wav-converter), and [another!](https://online-audio-converter.com) I provide no guarantees for these services, their data privacy or quality. I would personally use [Audacity (Free!)](https://www.audacityteam.org) or [RX Audio Editor (Expensive!)](https://www.izotope.com/en/rx.html) to avoid these issues.

Lastly, if your music file needs to loop cleanly be sure to edit the music file to end where you want the loop to reset. You can do this in one of the above music editors and there are tutorials out there to help you with this if needed.

{{< hint danger >}}
**.WAV File Compatibility**  
Some .WAV codecs and file conversion sites don't play well with XiMC; Logic Pro's WAV codec caused issues for me and I'm sure there are others. No idea why but if this issue comes up, try a different converter or process your .WAV file in another program.
{{< /hint >}}

#### Find Looping Points (if needed.)
If you have music you wish to have loop then we need to identify where we want the song to restart at. XiMC uses sample numbers to determine loop points in the track, which is annoying but necessary as seconds don't provide enough resolution to get good looping points.

You will need a program that can load your .WAV file and display the currently selected position in a track as a sample number. Most audio editing programs can do this (including [Audacity (Free!)](https://www.audacityteam.org) and [RX Audio Editor (Expensive!)](https://www.izotope.com/en/rx.html)) Here's an image below of what I mean:

![Scrubbings](images/SamplesScrubbingRX.png)

Find your loop point for the song, note down the sample number, then divide this number by 16. Round this number to the nearest whole number then convert it to 5 digit hexadecimal [here.](https://www.rapidtables.com/convert/number/decimal-to-hex.html)

##### Example:
1. Sample Loop Point: 1287910
2. Divide by 16: 1287910/16=80494.375
3. Round to nearest whole number: 80494
4. Convert to 5 digit hexidecimal: 13A6E

### 2. Convert your files with XiMC
XiMC (Final Fantasy XI Music Converter) is a program someone made in the 2000s. I know not of its providence or its safety. All I can say is that I've used it, nothing bad seemed to happen, and it converted my .WAV files to looping BGW files for use in FFXI. It is for Windows Only and a little hard to find, until now. 

[You can download my copy of XiMC here.](https://drive.google.com/file/d/1hcAz4WX3NUU87KPZKclcvYKnGnb6x3Fe/view?usp=sharing) It includes an updated list of music from FFXI so you can more easily identify the original game files you will need to replace.

So, open XiMC and you will be greeted with a mix of Japanese and broken unicode if you're on a non-Japanese based Windows install. Never fear though, I made a bad english translation on a screenshot for you to reference:

![XiMC Screenie](images/XiMCScreenshotEnglish.png)

From here the process is simple:
1. From the right hand menu, choose the song you wish to replace with your custom music.
2. In the WAV -> BGW  box, Input the looping hex code you generated into the 'Loop Point' field if you have a track that needs to loop cleanly. 
3. Press the file button and locate the custom music file you wish to convert. If your .WAV file is compatible it will output a file in the same folder as the original music file. If it didn't work nothing will be produced; there will be no error messages; no help is coming. I'm sorry.

Optional: Many audio players will natively play .bgw files. You can easily listen to your converted files using something like [Cog (MacOS)](https://cog.losno.co) and confirm they work as intended before testing that they work well in game. I don't know a good program for windows unfortunately. 🤷‍♂️

### 3. Replace the Original Files with your Custom Music

Go to your FFXI directory, find the music files you want to replace and... well replace them. It's good practice to append a ".old" to the end of the original FFXI file so you don't overwrite it. This makes your custom change easy to revert if you need to. In my experience this is useful but feel free to take the risk.

The last step is to log into FFXI, enter the zone/CS/battle that you intended your music to play during and see if it works! 

If you have significant custom music needs you may want to look into using [XIPivot](https://www.ffxiah.com/forum/topic/53575/xipivot-rom-mods-without-overwriting-originals/) for managing everything.

## FAQ and QIL (Questions I Like)
So what is actually happening here? Why is this such a mess? I think the first aspect of this problem we need to identify is the .BGW file format itself. So lets begin here.

### What is a .BGW file?
The way SquareEnix used them, these files were early [ATRAC](https://en.wikipedia.org/wiki/ATRAC) music files with an additional wrapper of information that is used in game. Part of that wrapper includes the looping start point but I suspect it also includes a looping endpoint and other details, even though these options are unavailable in XiMC.

### Why did SquareEnix use .BGW files?
Why do these damned things exist? In lieu of me interviewing the original producers, developers, and lawyers present at Square Enix in 2003, I will provide my theories for their existence:
1. They needed a way to protect their music from being pirated and distributed. Having this convoluted system achieved that for a time...
2. This was how they chose to enable looping music. Integrating it into the file format helps place the onus of quality checking the looped music onto the music producer rather than the game developers.

### Why Might One Need Custom FFXI Music?
This is a great question and I'm glad you asked it. Believe it or not, some did not enjoy Naoshi Mizuta's original soundtrack for FFXI. A casual peruse of old FFXI forums will highlight the chocobo riding music [Dash de Chocobo](https://www.youtube.com/watch?v=gg4AgvupLeE) as the main target for their ire (For what it's worth, I quite enjoyed it...) I needed it so that I could remake FFXI's music for the Private FFXI Server HorizonXI.

### Why Is My Music So Quiet?
The original FFXI music files are quite loud. Anywhere between 8-15 LUFS. Most of them have true peaks at and often above (!!!) 0. Even quieter tracks like [Jeweled Boughs](https://www.youtube.com/watch?v=XkD4jnvvV5A)! This is pretty loud. If you want your custom tracks to be a similar loudness then... you will need to process them to be louder before you go through all this trouble to put them into this old ass game.

RX Audio Editor has a quick and quality loudness manager module that can do this, although the quality of the original file will dictate how good it sounds post processing.

## The End
That's all I got for you. Hopefully this helps all of you who want Numb by Linkin' Park to play as the Battle Music in this game. Although genuinely, I hope this helps anyone else with music in their FFXI Private Server or those on retail who just want to spice things up.

The knowledge gather for this guide owes a debt to those who came 20 years before me. While incomplete, these were very helpful resources in piecing the puzzle together:

1. [LockeZ's Original 2006 FFXI Music Hacking Guide](https://gamefaqs.gamespot.com/pc/555735-final-fantasy-xi/faqs/30728)
2. [Zantetsu's 2011 BRSTM Music Looping Guide](https://smashboards.com/threads/how-to-make-looping-a-much-easier-task.306506/)
3. [Marty9819's 2016 Guide to Custom FFXI Music](https://www.reddit.com/r/ffxi/comments/5kpzzq/a_brief_guide_to_customized_music_in_ffxi_and_a/)
4. [FFXIAH's 2016 Thread Discussing Custom Music](https://jp.ffxiah.com/forum/topic/49467/full-bgw-list-for-ffxi-music-modding-questions/)

Let me know how it goes in the comments below and I might be able to help and I might help.

# Comments
{{< chat 2023CustomFFXIMusicTutorial >}}

