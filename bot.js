const Discord = require('discord.js');
const jc = require('jc-codes');
const fs = require("fs");
var Canvas = require('canvas');
var jimp = require('jimp');
const client = new Discord.Client();
var attentions = {};
const { Client, Util } = require('discord.js');
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('./config.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const YouTube_API_Token = `DOXl2w.eyHpVDCGPArmMyFuHD5vnYCZPhU`;
var YouTube_Client = require('youtube-node');
var yt = new YouTube_Client();
yt.setKey(YouTube_API_Token);



const prefix = '!';






client.on('ready', () => {
  console.log('Logging into discord..');
  console.log(`
  Login successful.

  -----------------
   - Discord Bot
  -----------------
  ${client.user.username}

  Connected to:
  ${client.guilds.size} servers
  ${client.channels.size} channel
  ${client.users.size} users

  Prefix: ${prefix}
  -----------------

  Use this url to bring your bot to a server:
  https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958588585`);

  });



  client.on('warn', console.warn);

  client.on('error', console.error);

  client.on('ready', () => console.log('Yo this ready!'));

  // client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

  // client.on('reconnecting', () => console.log('I am reconnecting now!'));

  client.on('message', async msg => { // eslint-disable-line
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREFIX)) return undefined;

    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);

    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length)

    if (command === "play") {
      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel) return msg.channel.send('أنا آسف ولكن عليك أن تكون في قناة صوتية لتشغيل الموسيقى!');
      const permissions = voiceChannel.permissionsFor(msg.client.user);
      if (!permissions.has('CONNECT')) {
        return msg.channel.send('لا أستطيع أن أتكلم في هذه القناة الصوتية، تأكد من أن لدي الصلاحيات الازمة !');
      }
      if (!permissions.has('SPEAK')) {
        return msg.channel.send('لا أستطيع أن أتكلم في هذه القناة الصوتية، تأكد من أن لدي الصلاحيات الازمة !');
      }
      if (!permissions.has('EMBED_LINKS')) {
        return msg.channel.sendMessage("**لا يوجد لدي صلاحيات `EMBED LINKS`**")
      }

      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
          const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
          await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
        }
        return msg.channel.send(` **${playlist.title}** تم اضافة القائمه!`);
      } else {
        try {
          var video = await youtube.getVideo(url);
        } catch (error) {
          try {
            var videos = await youtube.searchVideos(searchString, 5);
            let index = 0;
            const embed1 = new Discord.RichEmbed()
                .setDescription(`**اختار رقم المقطع** :
  ${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
            .setFooter("")
            msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})

            // eslint-disable-next-line max-depth
            try {
              var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                maxMatches: 1,
                time: 10000,
                errors: ['time']
              });
            } catch (err) {
              console.error(err);
              return msg.channel.send('لم يتم تحديد العدد لتشغيل الاغنيه.');
            }
            const videoIndex = parseInt(response.first().content);
            var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
          } catch (err) {
            console.error(err);
            return msg.channel.send(':x: لم أستطع الحصول على أية نتائج بحث.');
          }
        }
        return handleVideo(video, msg, voiceChannel);
      }
    } else if (command === "skip") {
      if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
      if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
      serverQueue.connection.dispatcher.end('Skip command has been used!');
      return undefined;
    } else if (command === "stop") {
      if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
      if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end('Stop command has been used!');
      return undefined;
    } else if (command === "vol") {
      if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
      if (!serverQueue) return msg.channel.send('There is nothing playing.');
      if (!args[1]) return msg.channel.send(`:loud_sound: Current volume is **${serverQueue.volume}**`);
      serverQueue.volume = args[1];
      serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
      return msg.channel.send(`:speaker: تم تغير الصوت الي **${args[1]}**`);
    } else if (command === "np") {
      if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.');
      const embedNP = new Discord.RichEmbed()
    .setDescription(`:notes: الان يتم تشغيل: **${serverQueue.songs[0].title}**`)
      return msg.channel.sendEmbed(embedNP);
    } else if (command === "queue") {

      if (!serverQueue) return msg.channel.send('There is nothing playing.');
      let index = 0;
      const embedqu = new Discord.RichEmbed()
    .setDescription(`**Songs Queue**

  ${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}

  **الان يتم تشغيل** ${serverQueue.songs[0].title}`)
      return msg.channel.sendEmbed(embedqu);
    } else if (command === "pause") {
      if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return msg.channel.send('تم إيقاف الموسيقى مؤقتا!');
      }
      return msg.channel.send('There is nothing playing.');
    } else if (command === "resume") {
      if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return msg.channel.send('استأنفت الموسيقى بالنسبة لك !');
      }
      return msg.channel.send('لا يوجد شيء حالي في العمل.');
    }


    return undefined;
  });

  async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);

  //	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
    const song = {
      id: video.id,
      title: Util.escapeMarkdown(video.title),
      url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
      const queueConstruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
      queue.set(msg.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(msg.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`I could not join the voice channel: ${error}`);
        queue.delete(msg.guild.id);
        return msg.channel.send(`I could not join the voice channel: ${error}`);
      }
    } else {
      serverQueue.songs.push(song);
      console.log(serverQueue.songs);
      if (playlist) return undefined;
      else return msg.channel.send(` **${song.title}** تم اضافه الاغنية الي القائمة!`);
    }
    return undefined;
  }

  function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
      .on('end', reason => {
        if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
        else console.log(reason);
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel.send(`بدء تشغيل: **${song.title}**`);
  }

  client.on('message', message =>{
    if(message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    var args = message.content.split(' ').slice(1);
    var argresult = args.join(' ');
    if (message.author.id !== "353911061260402688") return;



  if (message.content.startsWith(PREFIX + 'setstream')) {
    client.user.setGame(argresult, "https://www.twitch.tv/");
     console.log('test' + argresult);
      message.channel.sendMessage(`Streaming: **${argresult}`)
  }

  if (message.content.startsWith(PREFIX + 'setname')) {
    client.user.setUsername(argresult).then
      message.channel.sendMessage(`Username Changed To **${argresult}**`)
    return message.reply("You Can change the username 2 times per hour");
  }
  if (message.content.startsWith(PREFIX + 'setavatar')) {
    client.user.setAvatar(argresult);
     message.channel.sendMessage(`Avatar Changed Successfully To **${argresult}**`);
  }
});








//=invite

client.on('message' , message => {
  if (message.content === prefix + "invite") {
      if(!message.channel.guild) return message.reply('This Command is Only For Servers');
   const embed = new Discord.RichEmbed()
.setColor("RANDOM")
.setThumbnail(client.user.avatarURL)
.setAuthor(message.author.username, message.author.avatarURL)
.setTitle('Click Here To Invite The Bot')
.setURL('https://discordapp.com/api/oauth2/authorize?client_id=438416315393245185&permissions=8&scope=bot')
message.channel.sendEmbed(embed);
 }
});

//bot

client.on('message', message => {
  if (message.content === prefix + "bot") {
      if(!message.channel.guild) return;
  let embed = new Discord.RichEmbed()
.setColor("#8650a7")
.addField("** :white_check_mark: Servers: **" , client.guilds.size)
.addField("** :white_check_mark: Users: **" , client.users.size)
.addField("** :white_check_mark: Channels: **" , client.channels.size)
 .addField("** :rocket: Ping **" , Date.now() - message.createdTimestamp)
 .setTimestamp()
message.channel.sendEmbed(embed);
 }
});



//=mb



client.on('message', message => {
if(message.content == prefix + 'mb') {
const embed = new Discord.RichEmbed()
.setDescription(`**Members info🔋
:green_heart: online:   ${message.guild.members.filter(m=>m.presence.status == 'online').size}
:heart:dnd:       ${message.guild.members.filter(m=>m.presence.status == 'dnd').size}
:yellow_heart: idle:      ${message.guild.members.filter(m=>m.presence.status == 'idle').size}
:black_heart: offline:   ${message.guild.members.filter(m=>m.presence.status == 'offline').size}
:blue_heart:   all:  ${message.guild.memberCount}**`)
   message.channel.send({embed});

}
});































//avatar

client.on('message', message => {
  if (message.content.startsWith(prefix + "avatar")) {
      var mentionned = message.mentions.users.first();
  var x5bzm;
    if(mentionned){
        var x5bzm = mentionned;
    } else {
        var x5bzm = message.author;

    }
      const embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setImage(`${x5bzm.avatarURL}`)
    message.channel.sendEmbed(embed);
  }
});



//server

client.on('message', function(msg) {
if(msg.content.startsWith (prefix  + 'server2')) {
  if(!msg.channel.guild) return msg.reply('**:x: اسف لكن هذا الامر للسيرفرات فقط **');
  const millis = new Date().getTime() - msg.guild.createdAt.getTime();
  const noww = new Date();
  const createdAt = millis / 1000 / 60 / 60 / 24;
  let embed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setThumbnail(msg.guild.iconURL)
  .addField(`${msg.guild.name}`,`\`\`منذ ${createdAt.toFixed(0)} يوما \`\``)
  .addField(':earth_africa: ** موقع السيرفر**',`**[ ${msg.guild.region} ]**`,true)
  .addField(':military_medal:** الرتب**',`**[ ${msg.guild.roles.size} ]**`,true)
  .addField(':bust_in_silhouette:** عدد الاعضاء**',`**[ ${msg.guild.memberCount} ]**`,true)
  .addField(':white_check_mark:** عدد الاعضاء الاونلاين**',`**[ ${msg.guild.members.filter(m=>m.presence.status == 'online').size} ]**`,true)
  .addField(':pencil:** الرومات الكتابية**',`**[ ${msg.guild.channels.filter(m => m.type === 'text').size} ]**`,true)
  .addField(':loud_sound:** رومات الصوت**',`**[ ${msg.guild.channels.filter(m => m.type === 'voice').size} ]**`,true)
  .addField(':crown:** صاحب السيرفر**',`**[ ${msg.guild.owner} ]**`,true)
  .addField(':id:** ايدي السيرفر**',`**[ ${msg.guild.id} ]**`,true)
  msg.channel.send({embed:embed});
}
});




//roles



client.on('message', message => {
  if(message.author.bot) return;
  if(message.content.startsWith (prefix  + 'roles')) {
    if(!message.channel.guild) return message.reply('**:x: اسف لكن هذا الامر للسيرفرات فقط **');
      var roles = message.guild.roles.map(roles => `${roles.name}, `).join(' ')
      const embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .addField(':trophy:  عدد الرتب',`**[ ${message.guild.roles.size} ]**`)
      message.channel.sendEmbed(embed);
  }
});








client.on("message", message => {
  if (message.content === prefix + "help") {
   const embed = new Discord.RichEmbed()
       .setColor("#ffff00")
       .setThumbnail(message.author.avatarURL)
       .setDescription(`



 ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●

    ===============
      اوامر الادمين
    ===============
    ${prefix}bc
    ${prefix}unbans
    ${prefix}سجن
    ${prefix}افراج
    ${prefix}clear
    ${prefix}مسح
    ${prefix}broadcast
    ${prefix}de-colors
    ${prefix}add-colors
    ${prefix}servers
    ${prefix}delet
    ${prefix}ban
    ${prefix}kick
    ${prefix}ct
    ${prefix}cv
    ===============
       اوامر عامة
    ===============
    ${prefix}top
    ${prefix}send
    ${prefix}Free-GG
    ${prefix}free-gg
    ${prefix}invite
    ${prefix}bot
    ${prefix}mb
    ${prefix}create-colors
    ${prefix}gif
    ${prefix}setcolor
    ${prefix}autoroll
    ${prefix}sug
    ${prefix}ذكرني
    ${prefix}myinvite
    ${prefix}mutechannel
    ${prefix}unmutechannel
    ${prefix}roles
    ${prefix}edit
    ${prefix}members
    ${prefix}data
    ${prefix}rooms
    ${prefix}animal
    ${prefix}image
    ${prefix}embed
    ${prefix}say
    ${prefix}ping
    ${prefix}server2
    ${prefix}avatar
    ===============
      اوامر موسيقى
    ===============
    ${prefix}play
    ${prefix}skip
    ${prefix}stop
    ${prefix}vol
    ${prefix}np
    ${prefix}queue
    ${prefix}pause
    ===============
       الرسائل
    ===============
    map GTA V
    map GTA 5
    back
    باك
    welcome
    السلام عليكم
    what is prefix for bot
    ===============
       الالعاب
    ===============
    ${prefix}دين
    ${prefix}لو خيروك
    ${prefix}عقاب
    ${prefix}صراحه
    ${prefix}هل تعلم
    ${prefix}حكم
    ${prefix}اذكار
    ${prefix}مريم
    ${prefix}كت تويت
    ${prefix}خواطر

 ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●

 💎『الدعم الفني والمساعدة』💎

 ${prefix}invite | القسم الاول لي اضافه البوت

 ${prefix}support| القسم الثاني  الدعم الفني و المساعدة

 <@353911061260402688>  | القسم الثالث مصمم البوت

 ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●




 `)


 message.author.sendEmbed(embed)

 }
 });






 client.on('message', message => {
  if(!message.channel.guild) return;
if (message.content.startsWith(prefix + 'ping')) {
if(!message.channel.guild) return;
var msg = `${Date.now() - message.createdTimestamp}`
var api = `${Math.round(client.ping)}`
if (message.author.bot) return;
let embed = new Discord.RichEmbed()
.setAuthor(message.author.username,message.author.avatarURL)
.setThumbnail('https://cdn.discordapp.com/avatars/368141321547808768/c42716e13cb850f9ad0930af699472d0.png?size=2048nk')
.setColor('RANDOM')
.addField('**Time Taken:**',msg + " ms")
.addField('**WebSocket:**',api + " ms")
message.channel.send({embed:embed});
}
})








client.on("message", (message) => {
  if(message.author.bot) return;
  if (message.content.startsWith(prefix + "ct")) {
              if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply("You Don't Have `MANAGE_CHANNELS` Premissions ");
          let args = message.content.split(" ").slice(1);
      message.guild.createChannel(args.join(' '), 'text');
  message.channel.sendMessage('تـم إنـشاء روم كـتابـي')

  }
  });
  client.on("message", (message) => {
    if(message.author.bot) return;
  if (message.content.startsWith(prefix + "cv")) {
              if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply("You Don't Have `MANAGE_CHANNELS` Premissions ");
          let args = message.content.split(" ").slice(1);
      message.guild.createChannel(args.join(' '), 'voice');
      message.channel.sendMessage('تـم إنـشاء روم صـوتي')

  }
  });




  client.on('message', message => {
    if (message.content.startsWith(prefix + "خواطر")) {
                 if(!message.channel.guild) return message.reply('** This command only for servers**');
   var embed = new Discord.RichEmbed()
   .setColor('RANDOM')

    .setThumbnail(message.author.avatarURL)
  .addField('لعبه خواطر' ,
   `${secreT[Math.floor(Math.random() * secreT.length)]}`)
   message.channel.sendEmbed(embed);
   console.log('[id] Send By: ' + message.author.username)
     }
 });






 const cuttweet = [
  'كت تويت ‏| تخيّل لو أنك سترسم شيء وحيد فيصبح حقيقة، ماذا سترسم؟',
  'كت تويت | أكثر شيء يُسكِت الطفل برأيك؟',
  'كت تويت | الحرية لـ ... ؟',
  'كت تويت | قناة الكرتون المفضلة في طفولتك؟',
  'كت تويت ‏| كلمة للصُداع؟',
  'كت تويت ‏| ما الشيء الذي يُفارقك؟',
  'كت تويت | موقف مميز فعلته مع شخص ولا يزال يذكره لك؟',
  'كت تويت ‏| أيهما ينتصر، الكبرياء أم الحب؟',
  'كت تويت | بعد ١٠ سنين ايش بتكون ؟',
  'كت تويت ‏| مِن أغرب وأجمل الأسماء التي مرت عليك؟',
  '‏كت تويت | عمرك شلت مصيبة عن شخص برغبتك ؟',
  'كت تويت | أكثر سؤال وجِّه إليك مؤخرًا؟',
  '‏كت تويت | ما هو الشيء الذي يجعلك تشعر بالخوف؟',
  '‏كت تويت | وش يفسد الصداقة؟',
  '‏كت تويت | شخص لاترفض له طلبا ؟',
  '‏كت تويت | كم مره خسرت شخص تحبه؟.',
  '‏كت تويت | كيف تتعامل مع الاشخاص السلبيين ؟',
  '‏كت تويت | كلمة تشعر بالخجل اذا قيلت لك؟',
  '‏كت تويت | جسمك اكبر من عٌمرك او العكسّ ؟!',
  '‏كت تويت |أقوى كذبة مشت عليك ؟',
  '‏كت تويت | تتأثر بدموع شخص يبكي قدامك قبل تعرف السبب ؟',
  'كت تويت | هل حدث وضحيت من أجل شخصٍ أحببت؟',
  '‏كت تويت | أكثر تطبيق تستخدمه مؤخرًا؟',
  '‏كت تويت | ‏اكثر شي يرضيك اذا زعلت بدون تفكير ؟',
  '‏كت تويت | وش محتاج عشان تكون مبسوط ؟',
  '‏كت تويت | مطلبك الوحيد الحين ؟',
  '‏كت تويت | هل حدث وشعرت بأنك ارتكبت أحد الذنوب أثناء الصيام؟',
]

client.on('message', message => {
if (message.content.startsWith(prefix + "كت تويت")) {
             if(!message.channel.guild) return message.reply('** This command only for servers**');
var embed = new Discord.RichEmbed()
.setColor('RANDOM')
.setThumbnail(message.author.avatarURL)
.addField('لعبه كت تويت' ,
`${cuttweet[Math.floor(Math.random() * cuttweet.length)]}`)
message.channel.sendEmbed(embed);
console.log('[id] Send By: ' + message.author.username)
 }
});

const secreT = [
"**الحياة بكل ما فيها تقف دائمًا على حد الوسطية بين اتزان المعنى وضده من حب وكره وحق وباطل وعدل وظلم**.",
"**كى تعيش عليك ان تتقن فن التجاهل باحتراف**.",
"**لا تحزن على من اشعرك بان طيبتك غباء امام وقاحته**.",
"**هناك من يحلم بالنجاح وهناك من يستيقظ باكرا لتحقيقه**.",
"**ان تعالج ألمك بنفسك تلك هى القوة**.",
"**الجميع يسمع ما تقول والاصدقاء ينصتون لما تقول وافضل الاصدقاء ينصتون لما اخفاه سكوتك**.",
"**انتهى زمن الفروسية ، لم تنقرض الخيول بل انقرض الفرسان**.",
"**ان تكون اخرسا عاقلا خير من ان تكون نطوقا جهولا**.",
"**المناقشات العقيمة لا تنجب افكارا**.",
"**نحن نكتب ما لا نستطيع ان نقول وما نريد ان يكون**.",
"**نحن نكتب ما لا نستطيع ان نقول وما نريد ان يكون**.",
]











  client.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length);

    let args = message.content.split(" ").slice(1);

  // pro.say
    if (command === "say") {
            message.delete()
      message.channel.sendMessage(args.join(" ")).catch(console.error);
    }



  if (command == "embed") {
      let say = new Discord.RichEmbed()
      .setDescription(args.join("  "))
      .setColor(0x23b2d6)
      message.channel.sendEmbed(say);
      message.delete();
    }


  });


     client.on("message", message => {

            if(!message.channel.guild) return;
     if(message.author.bot) return;
        if(message.content === prefix + "image"){
            const embed = new Discord.RichEmbed()

        .setTitle(`This is  ** ${message.guild.name} **  Photo !`)
    .setAuthor(message.author.username, message.guild.iconrURL)
      .setColor(0x164fe3)
      .setImage(message.guild.iconURL)
      .setURL(message.guild.iconrURL)
                      .setTimestamp()

     message.channel.send({embed});
        }
    });

    client.on('message', (message) => {
      if(message.author.bot) return;
      if (message.content.startsWith(prefix + 'kick')) {
          var member= message.mentions.members.first();
          member.kick().then((member) => {
              message.channel.send(member.displayName + ' تم طرد هذا الشخص من السيرفر');
          }).catch(() => {
              message.channel.send(":x:");
          });
      }
  });



    client.on("message", (message) => {
      if(message.author.bot) return;
      if (message.content.startsWith(prefix + 'delet')) {
          if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply("You Don't Have `MANAGE_CHANNELS` Premissions ");

          let args = message.content.split(' ').slice(1);
          let channel = message.client.channels.find('name', args.join(' '));
          if (!channel) return message.reply('**There is no room like this name -_-**').catch(console.error);
          channel.delete()
      }
  });


  client.on('message', message => {
       if (message.content === prefix + "servers") {
       let embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("**| السيرفرات |**" , client.guilds.size)
    message.channel.sendEmbed(embed);
      }
  });


  var cats = ["https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg","http://www.dogbazar.org/wp-content/uploads/2014/09/british-bull-dog-puppies.jpg","http://cdn2-www.dogtime.com/assets/uploads/gallery/german-shepherd-dog-breed-pictures/standing-7.jpg","http://cdn.akc.org/Marketplace/Breeds/German_Shepherd_Dog_SERP.jpg","https://animalso.com/wp-content/uploads/2016/12/black-german-shepherd_2.jpg","https://static.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpg","https://www.petfinder.com/wp-content/uploads/2012/11/101438745-cat-conjunctivitis-causes.jpg","http://www.i-love-cats.com/images/2015/04/12/cat-wallpaper-38.jpg","https://www.aspca.org/sites/default/files/cat-care_urine-marking_main-image.jpg","https://s-media-cache-ak0.pinimg.com/originals/f0/3b/76/f03b7614dfadbbe4c2e8f88b69d12e04.jpg","http://www.rd.com/wp-content/uploads/sites/2/2016/04/15-cat-wants-to-tell-you-attention.jpg","https://www.thelocal.de/userdata/images/article/fa6fd5014ccbd8f4392f716473ab6ff354f871505d9128820bbb0461cce1d645.jpg","https://www.adelaidezoo.com.au/wp-content/uploads/sites/2/animals/GiantPanda3Slider.jpg","http://imagem.band.com.br/f_230168.jpg"]
      client.on('message', message => {
          var args = message.content.split(" ").slice(1);
      if(message.content.startsWith(prefix + 'animal')) {
           var cat = new Discord.RichEmbed()
  .setImage(cats[Math.floor(Math.random() * cats.length)])
  message.channel.sendEmbed(cat);
      }
  });






    client.on('message', message => {
      if (message.content === prefix + "rooms") {
                        if (!message.guild) return;

          var channels = message.guild.channels.map(channels => `${channels.name}, `).join(' ')
          const embed = new Discord.RichEmbed()
          .setColor('RANDOM')
          .addField(`${message.guild.name}`,`**Rooms:white_check_mark:**`)
          .addField(':arrow_down: Rooms Number. :heavy_check_mark:',`** ${message.guild.channels.size}**`)

  .addField(':arrow_down:Rooms  Name. :heavy_check_mark::',`**[${channels}]**`)
          message.channel.sendEmbed(embed);
      }
  });


    const HeRo = new Discord.Client();
    client.on('message', message => {
        if (message.content === prefix + "date") {
            if (!message.channel.guild) return message.reply('** This command only for servers **');
            var currentTime = new Date(),
                Year = currentTime.getFullYear(),
                Month = currentTime.getMonth() + 1,
                Day = currentTime.getDate();

                var Date15= new Discord.RichEmbed()
                .setTitle("**『  Date - التاريخ 』 **")
                .setColor('RANDOM')
                .setTimestamp()
                .setDescription( "『"+ Day + "-" + Month + "-" + Year + "』")
                 message.channel.sendEmbed(Date15);
        }
    });




      client.on('message', message => {
                if (!message.channel.guild) return;
        if(message.content ==prefix + 'members')
        var IzRo = new Discord.RichEmbed()
        .setThumbnail(message.author.avatarURL)
        .setFooter(message.author.username, message.author.avatarURL)
        .setTitle(':tulip:| Members info')
        .addBlankField(true)
        .addField(':green_book:| الاونلاين ',
        `${message.guild.members.filter(m=>m.presence.status == 'online').size}`)
        .addField(':closed_book:| دي ان دي',`${message.guild.members.filter(m=>m.presence.status == 'dnd').size}`)
        .addField(':orange_book:| خامل',`${message.guild.members.filter(m=>m.presence.status == 'idle').size}`)
        .addField(':notebook:| الاوف لاين ',`${message.guild.members.filter(m=>m.presence.status == 'offline').size}`)
        .addField('عدد اعضاء السيرفر',`${message.guild.memberCount}`)
        message.channel.send(IzRo);
      });










  client.on('message', message => {
      if (message.content === prefix + "roles") {
          var roles = message.guild.roles.map(roles => `${roles.name}, `).join(' ')
          const embed = new Discord.RichEmbed()
          .setColor('RANDOM')
          .addField('الرتب:',`**[${roles}]**`)
          message.channel.sendEmbed(embed);
      }
  });









  client.on('ready', () => {
     client.user.setGame(" pro.help | pro.invite |  pro.support ");
  });

  client.on("message", message => {
    if(message.author.bot) return;
              var args = message.content.substring(prefix.length).split(" ");
              if (message.content.startsWith(prefix + "clear22")) {
   if (!args[1]) {
                                  let x5bz1 = new Discord.RichEmbed()
                                  .setDescription("hhclear <number>")
                                  .setColor("#0000FF")
                                  message.channel.sendEmbed(x5bz1);
                              } else {
                              let messagecount = parseInt(args[1]);
                              message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                                                            message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                              message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
                              let x5bz2 = new Discord.RichEmbed()
                                                              .setColor("#008000")
                                  .setDescription(":white_check_mark: | Delete " + args[1] + " Message!")
                                                                                          message.delete("..");
                                  message.channel.sendEmbed(x5bz2);
                              }
                            }
  });







client.on('message' , message => {
  if (message.content === prefix + "support") {
      if(!message.channel.guild) return message.reply('This Command is Only For Servers');
   const embed = new Discord.RichEmbed()
.setColor("RANDOM")
.setThumbnail(client.user.avatarURL)
.setAuthor(message.author.username, message.author.avatarURL)
.setTitle('ل اي استفسار')
.setURL(`https://discord.gg/Bt4s7r5`)
message.channel.sendEmbed(embed);
 }
});





  client.on('message', message => {
       if (message.content === prefix + "support") {
       let embed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor("#9B59B6")
    .addField(" Done | تــــم" , " |  تــــم ارســالك في الخــاص")



    message.channel.sendEmbed(embed);
      }
  });







  client.on('message', message=>{
      if (message.content ===prefix + 'add-colors'){
          if (message.channel.guild){
              if (message.member.hasPermission('MANAGE_ROLES')){
                  setInterval(function(){})
                    let count = 0;
                    let ecount = 0;
          for(let x = 0; x < 250; x++){
              message.guild.createRole({name:x,
              color: 'RANDOM'})
        }
              }else{
                  message.channel.sendMessage(':warning: You do not have permission to write this command')
              }
          }else{
              message.channel.sendMessage(':warning:  This command only in servers')
          }
      }
      if (message.content === prefix + 'de-colors'){
                  if (message.channel.guild){
              if (message.member.hasPermission('MANAGE_ROLES')){
                  setInterval(function(){})
                    let count = 0;
                    let ecount = 0;
          for(let x = 0; x < 250; x++){
              message.guild.roles.find('name', x)
        }
              }else{
                  message.channel.sendMessage(':warning: You do not have permission to write this command')
              }
          }else{
              message.channel.sendMessage(':warning:  This command only in servers')
          }
      }

  })












  const zead = [
     '*** انا اسمي مريم ***',
     '*** مرحباَ ماهو اسمك ؟ ***',
     `*** اهلا بك ! انا تائهه في هذا المكان  ***`,
     '*** هل تود مساعدتي ؟ ***',
     '*** لماذا هل انت قاسي القلب ؟ ***',
     '*** انني اشفق عليك عليك يجب ان تطهر روحك وتحب الخير للجميع ***',
     '*** ابتعد عني قليل انني متعبة ***',
     '*** هل انت نادم على ماقلت ؟ ***',
     '*** ابتعد عني قليل انني متعبة ***',
     '*** هل انت نادم على ماقلت ؟ ***',
     '*** هل تود مساعدتي ؟ ***',
     '*** واو اشكرك انك شخصاَ رائع ! ***',
     '*** ابحث معي عن منزلي لقد كان قريباَ من هنا ***',
     '*** ولاكن عندما حل الليل لم اعد ارى اي شيء ***',
     '*** مذا تظن اين يوجد ؟ يمين او يسار ***',
     '*** هيا اذاَ ***',
     '*** اود ان اسئلك سؤال ونحن في الطريق ***',
     '*** هل تراني فتاة لطيفة ام مخيفة ***',
     '*** اشكرك !  ***',
     '*** لقد وصلنا الى المنزل شكراَ جزيلَ انتطرني ثواني وسوف اعود ***',
     '*** هل انت جاهز ؟ ***',
     '*** لقد اخبرت والدي عنك وهم متحمسين لرؤيتك ***',
     '*** هل تود ان تراهم الان ***',
  '*** انا لست الحوت الازرق كما يدعون ***',
     '*** انا لست كاذبة صدقني***',
     '*** لماذا ارى في عينيك الخوف ؟ ***',
     '*** انا مجرد فتاة لطيفة تحب اللعب مع الجميع ***',
     '*** اعرف كل شيء يحدث اسمع ذالك بالراديو ***',
     '*** سمعت ان البشر يقتلون من اجل المال فقط ***',
     '*** لماذا لم تدخل الغرفة ؟ ***',
     '*** ههههههههههههههههههه انت الان مسجون في هذه الغرفة ***',
     '*** لن تخرج حتى اعود لك بعد قليل ***',
     '*** المفتاح معك ! اكتب .مريم  ***',
     '*** مفتاح احمر , هل حصلت عليه ؟ ***',
     '*** ان لم تحصل عليه , اكتب .مريم مرة اخرى ***',
     '*** مفتاح اسود . هل حصلت عليه ؟ ***',
     '*** اين تريد ان تختبئ بسرعة قبل ان تعود ***',
     '*** لقد عادت من جديد الى المنزل ***',
     '*** لا تصدر اي صوت ! ***',
     '*** مريم : لقد عدت ***',
     '*** مريم : يا ايها المخادع اين انت ***',
     '*** مريم : اعلم انك هنا في المنزل ***',
     '*** مريم : ماذا تريد ان تسمع ***',
     '*** مريم : اضغط على الرابط اهداء مني لك | https://www.youtube.com/watch?v=hvSiuQccmtg ***',
     '*** احد ما خرج من المنزل ***',
     '*** انتظر الجزء الثاني عندما يوصل البوت 100 سيرفر , ساعدنا في نشر البوت وادخل هذا السيرفر  ***'
  ]
   client.on('message', message => {
   if (message.content.startsWith(prefix + 'مريم')) {
    var mariam= new Discord.RichEmbed()
    .setTitle("لعبة مريم ..")
    .setColor('RANDOM')
    .setDescription(`${zead[Math.floor(Math.random() * zead.length)]}`)
    .setImage("https://www.npa-ar.com/wp-content/uploads/2017/08/%D9%84%D8%B9%D8%A8%D8%A9-%D9%85%D8%B1%D9%8A%D9%85-300x200.jpg")
     message.channel.sendEmbed(mariam);
     message.react("??")
    }
  });








  const adkar = [
    '**اذكار  | **اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ.',
    '**اذكار  |  **اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى. ',
    '**اذكار  ‏|  **اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ، وَجِلَّهُ، وَأَوَّلَهُ، وَآخِرَهُ، وَعَلَانِيَتَهُ، وَسِرَّهُ. ',
    '**‏اذكار  |  **أستغفر الله .',
    '**‏اذكار  | **الْلَّهُ أَكْبَرُ',
    '**‏اذكار  |  **لَا إِلَهَ إِلَّا اللَّهُ',
    '**اذكار  |  **اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ , وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ , اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ.',
    '**اذكار  |  **سُبْحَانَ الْلَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا الْلَّهُ، وَالْلَّهُ أَكْبَرُ',
    '**اذكار  | **لَا إلَه إلّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلُّ شَيْءِ قَدِيرِ.',
    '**اذكار  | **أسْتَغْفِرُ اللهَ وَأتُوبُ إلَيْهِ',
    '**‏اذكار  | **سُبْحـانَ اللهِ وَبِحَمْـدِهِ. ',
    '‏**اذكار**|  لَا إلَه إلّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءِ قَدِيرِ.',
    '**اذكار  ‏|   **اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.',
    '**اذكار  | ‏ **يَا رَبِّ , لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ , وَلِعَظِيمِ سُلْطَانِكَ.',
    'اذكار    |  **أسْتَغْفِرُ اللهَ العَظِيمَ الَّذِي لاَ إلَهَ إلاَّ هُوَ، الحَيُّ القَيُّومُ، وَأتُوبُ إلَيهِ.**',
    '**‏اذكار  |  **اللَّهُمَّ إِنَّا نَعُوذُ بِكَ مِنْ أَنْ نُشْرِكَ بِكَ شَيْئًا نَعْلَمُهُ ، وَنَسْتَغْفِرُكَ لِمَا لَا نَعْلَمُهُ.',
    '**‏اذكار  |  **اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ على نَبِيِّنَا مُحمَّد. ',
    '**‏اذكار  |  **أَعـوذُ بِكَلِمـاتِ اللّهِ التّـامّـاتِ مِنْ شَـرِّ ما خَلَـق.',
    '**اذكار  |  **يَا حَيُّ يَا قيُّومُ بِرَحْمَتِكَ أسْتَغِيثُ أصْلِحْ لِي شَأنِي كُلَّهُ وَلاَ تَكِلْنِي إلَى نَفْسِي طَـرْفَةَ عَيْنٍ. ',
    '**اذكار  |  **اللّهُـمَّ إِنّـي أَعـوذُ بِكَ مِنَ الْكُـفر ، وَالفَـقْر ، وَأَعـوذُ بِكَ مِنْ عَذابِ القَـبْر ، لا إلهَ إلاّ أَنْـتَ.',
    '**‏اذكار  |  **اللّهُـمَّ عافِـني في بَدَنـي ، اللّهُـمَّ عافِـني في سَمْـعي ، اللّهُـمَّ عافِـني في بَصَـري ، لا إلهَ إلاّ أَنْـتَ.',
    '**‏اذكار  |  **سُبْحـانَ اللهِ وَبِحَمْـدِهِ عَدَدَ خَلْـقِه ، وَرِضـا نَفْسِـه ، وَزِنَـةَ عَـرْشِـه ، وَمِـدادَ كَلِمـاتِـه. ',
    '**‏اذكار  |  **اللّهُـمَّ بِكَ أَصْـبَحْنا وَبِكَ أَمْسَـينا ، وَبِكَ نَحْـيا وَبِكَ نَمُـوتُ وَإِلَـيْكَ النُّـشُور.',
    '**‏اذكار  |  **بِسـمِ اللهِ الذي لا يَضُـرُّ مَعَ اسمِـهِ شَيءٌ في الأرْضِ وَلا في السّمـاءِ وَهـوَ السّمـيعُ العَلـيم. ',
    '**‏اذكار  |  **حَسْبِـيَ اللّهُ لا إلهَ إلاّ هُوَ عَلَـيهِ تَوَكَّـلتُ وَهُوَ رَبُّ العَرْشِ العَظـيم.',
    '**اذكار  |  **اللّهُـمَّ ما أَصْبَـَحَ بي مِـنْ نِعْـمَةٍ أَو بِأَحَـدٍ مِـنْ خَلْـقِك ، فَمِـنْكَ وَحْـدَكَ لا شريكَ لَـك ، فَلَـكَ الْحَمْـدُ وَلَـكَ الشُّكْـر.',
    '**‏اذكار  |  **اللّهُـمَّ إِنِّـي أَصْبَـحْتُ أُشْـهِدُك ، وَأُشْـهِدُ حَمَلَـةَ عَـرْشِـك ، وَمَلَائِكَتَكَ ، وَجَمـيعَ خَلْـقِك ، أَنَّـكَ أَنْـتَ اللهُ لا إلهَ إلاّ أَنْـتَ وَحْـدَكَ لا شَريكَ لَـك ، وَأَنَّ ُ مُحَمّـداً عَبْـدُكَ وَرَسـولُـك',
    '**‏اذكار  |  **رَضيـتُ بِاللهِ رَبَّـاً وَبِالإسْلامِ ديـناً وَبِمُحَـمَّدٍ صلى الله عليه وسلم نَبِيّـاً',
    '**‏اذكار  |  **اللهم إني أعوذ بك من العجز، والكسل، والجبن، والبخل، والهرم، وعذاب القبر، اللهم آت نفسي تقواها، وزكها أنت خير من زكاها. أنت وليها ومولاها. اللهم إني أعوذ بك من علم لا ينفع، ومن قلب لا يخشع، ومن نفس لا تشبع، ومن دعوة لا يستجاب لها',
    '**‏اذكار  |  **اللهم إني أعوذ بك من شر ما عملت، ومن شر ما لم أعمل',
    '**‏اذكار  |  **اللهم مصرف القلوب صرف قلوبنا على طاعتك',
  ]
  client.on('message', message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + 'اذكار')) {
    if(!message.channel.guild) return;
  var client= new Discord.RichEmbed()
  .setTitle("اذكار")
  .setThumbnail(message.author.avatarURL)
  .setColor('RANDOM')
  .setDescription(`${adkar[Math.floor(Math.random() * adkar.length)]}`)
                 .setTimestamp()
  message.channel.sendEmbed(client);
  message.react("??")
  }
  });






  const kingmas = [
    '*** منشن الجميع وقل انا اكرهكم. ***',
 '*** اتصل على امك و قول لها انك تحبها :heart:. ***',
    '***     تصل على الوالده  و تقول لها  احب وحده.***',
    '*** تتصل على شرطي تقول له عندكم مطافي.***',
    '*** صور اي شيء يطلبه منك الاعبين.***',
    '*** اكتب في الشات اي شيء يطلبه منك الاعبين في الخاص. ***',
    '*** اتصل على احد من اخوياك  خوياتك , و اطلب منهم مبلغ على اساس انك صدمت بسيارتك.***',
    '*** اعطي اي احد جنبك كف اذا مافيه احد جنبك اعطي نفسك و نبي نسمع صوت الكف.***',
    '***  تروح عند شخص تقول له احبك. ***',
    '***روح عند اي احد بالخاص و قول له انك تحبه و الخ.***',
    '*** اذهب الى واحد ماتعرفه وقل له انا كيوت وابي بوسه. ***',
    '*** روح الى اي قروب عندك في الواتس اب و اكتب اي شيء يطلبه منك الاعبين  الحد الاقصى 3 رسائل. ***',
    '*** اذا انت ولد اكسر اغلى او احسن عطور عندك اذا انتي بنت اكسري الروج حقك او الميك اب حقك. ***',
    '*** ذي المرة لك لا تعيدها.***',
    '*** ارمي جوالك على الارض بقوة و اذا انكسر صور الجوال و ارسله في الشات العام.***',
    '*** اتصل على ابوك و قول له انك رحت مع بنت و احين هي حامل..... ***',
    '*** تكلم باللهجة السودانية الين يجي دورك مرة ثانية.***',
    '***سو مشهد تمثيلي عن مصرية بتولد.***',
    '*** قول نكتة اذا و لازم احد الاعبين يضحك اذا محد ضحك يعطونك ميوت الى ان يجي دورك مرة ثانية. ***',
    '*** قول نكتة اذا و لازم احد الاعبين يضحك اذا محد ضحك يعطونك ميوت الى ان يجي دورك مرة ثانية.***',
    '*** سامحتك خلاص مافيه عقاب لك :slight_smile:. ***',
    '*** اذهب الى واحد ماتعرفه وقل له انا كيوت وابي بوسه.***',
    '*** تتصل على الوالده  و تقول لها خطفت شخص. ***',
    '*** روح اكل ملح + ليمون اذا مافيه اكل اي شيء من اختيار الي معك.  ***'
 ]
  client.on('message', message => {
  if (message.content.startsWith(prefix + 'حكم')) {
   var mariam= new Discord.RichEmbed()
   .setTitle("لعبة حكم ..")
   .setColor('RANDOM')
   .setDescription(`${kingmas[Math.floor(Math.random() * kingmas.length)]}`)
    message.channel.sendEmbed(mariam);
    message.react(":thinking:")
   }
 });


 client.on("message", message => {

if(message.author.bot) return;
    if (message.content.startsWith(prefix + "broadcast")) {
                 if (!message.member.hasPermission("ADMINISTRATOR"))  return;
let args = message.content.split(" ").slice(1);
var argresult = args.join(' ');
message.guild.members.filter(m => m.presence.status !== 'offline').forEach(m => {
m.send(`${argresult}\n ${m}`);
})
message.channel.send(`\`${message.guild.members.filter(m => m.presence.status !== 'online').size}\` : عدد الاعضاء المستلمين`);
message.delete();
};
});




var memes =["http://www.shuuf.com/shof/uploads/2015/09/09/jpg/shof_b9d73150f90a594.jpg","https://haltaalam.info/wp-content/uploads/2015/05/0.208.png","https://haltaalam.info/wp-content/uploads/2015/05/266.png","https://haltaalam.info/wp-content/uploads/2015/05/250.png","https://haltaalam.info/wp-content/uploads/2017/02/0.2517.png","https://pbs.twimg.com/media/CP0mi02UAAA3U2z.png","http://www.shuuf.com/shof/uploads/2015/08/31/jpg/shof_3b74fa7295ec445.jpg","http://www.shuuf.com/shof/uploads/2015/08/22/jpg/shof_fa3be6ab68fb415.jpg","https://pbs.twimg.com/media/CSWPvmRUcAAeZbt.png","https://pbs.twimg.com/media/B18VworIcAIMGsE.png"]
client.on('message', message => {
if(message.content.startsWith(prefix + 'هل تعلم')) {
     var embed = new Discord.RichEmbed()
.setImage(memes[Math.floor(Math.random() * memes.length)])
message.channel.sendEmbed(embed);
}
});


client.on('message', message => {
  if(message.author.bot) return;
    var args = message.content.split(" ").slice(1);
    if(message.content.startsWith(prefix + 'id')) {
    var year = message.author.createdAt.getFullYear()
    var month = message.author.createdAt.getMonth()
    var day = message.author.createdAt.getDate()
    var men = message.mentions.users.first();
    let args = message.content.split(' ').slice(1).join(' ');
    if (args == '') {
    var z = message.author;
    }else {
    var z = message.mentions.users.first();
    }

    let d = z.createdAt;
    let n = d.toLocaleString();
    let x;
    let y;

    if (z.presence.game !== null) {
    y = `${z.presence.game.name}`;
    } else {
    y = "No Playing... |💤.";
    }
    if (z.bot) {
    var w = 'بوت';
    }else {
    var w = 'عضو';
    }
    let embed = new Discord.RichEmbed()
    .setColor("#502faf")
    .addField('🔱| اسمك:',`**<@` + `${z.id}` + `>**`, true)
    .addField('🛡| ايدي:', "**"+ `${z.id}` +"**",true)
    .addField('♨| Playing:','**'+y+'**' , true)
    .addField('🤖| نوع حسابك:',"**"+ w + "**",true)
    .addField('📛| الكود حق حسابك:',"**#" +  `${z.discriminator}**`,true)
    .addField('**التاريح الذي انشئ فيه حسابك | 📆 **: ' ,year + "-"+ month +"-"+ day)
    .addField("**تاريخ دخولك للسيرفر| ⌚   :**", message.member.joinedAt.toLocaleString())

    .addField('**⌚ | تاريخ انشاء حسابك الكامل:**', message.author.createdAt.toLocaleString())
    .addField("**اخر رسالة لك | 💬  :**", message.author.lastMessage)

    .setThumbnail(`${z.avatarURL}`)
    .setFooter(message.author.username, message.author.avatarURL)

    message.channel.send({embed});
        if (!message) return message.reply('**ضع المينشان بشكل صحيح  ❌ **').catch(console.error);

    }

    });







    client.on('message', message => {
if(message.author.bot) return;
        if (message.content === prefix + "mutechannel") {
                            if(!message.channel.guild) return message.reply(' This command only for servers');

    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(' ليس لديك صلاحيات');
               message.channel.overwritePermissions(message.guild.id, {
             SEND_MESSAGES: false

               }).then(() => {
                   message.reply("تم تقفيل الشات :white_check_mark: ")
               });
                 }

    if (message.content === prefix + "unmutechannel") {
        if(!message.channel.guild) return message.reply(' This command only for servers');

    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('ليس لديك صلاحيات');
               message.channel.overwritePermissions(message.guild.id, {
             SEND_MESSAGES: true

               }).then(() => {
                   message.reply("تم فتح الشات:white_check_mark:")
               });
                 }



    });























        client.on('message', message => {
            if (message.content.startsWith(prefix + "myinvite")) {
            message.guild.fetchInvites()
            .then(invites => message.channel.send(`انت جبت   ${invites.find(invite => invite.inviter.id === message.author.id).uses} عضو لهاذا السيرفر`))

            }
        });






        client.on("message", m =>{
          if(message.author.bot) return;
            if(m.content == "SuperXCraft اطلع من السيرفر يا"){
          m.guild.leave()
              .then(g => console.log(`Left the guild ${g}`))
              .catch(console.error);
           }
        });


        client.on('message', msg => {
            if (msg.content === 'back') {
              msg.channel.send('**Welcome Back !**');
            }
          });;






            client.on('message', msg => {
              if (msg.content === 'SuperXCraft اطلع من السيرفر يا') {
                msg.channel.send('**```OK I WILL GO OUT !```**');
              }
            });;




          const Sra7a = [
            'صراحه  |  صوتك حلوة؟',
            'صراحه  |  التقيت الناس مع وجوهين؟',
            'صراحه  |  شيء وكنت تحقق اللسان؟',
            'صراحه  |  أنا شخص ضعيف عندما؟',
            'صراحه  |  هل ترغب في إظهار حبك ومرفق لشخص أو رؤية هذا الضعف؟',
            'صراحه  |  يدل على أن الكذب مرات تكون ضرورية شي؟',
            'صراحه  |  أشعر بالوحدة على الرغم من أنني تحيط بك كثيرا؟',
            'صراحه  |  كيفية الكشف عن من يكمن عليك؟',
            'صراحه  |  إذا حاول شخص ما أن يكرهه أن يقترب منك ويهتم بك تعطيه فرصة؟',
            'صراحه  |  أشجع شيء حلو في حياتك؟',
            'صراحه  |  طريقة جيدة يقنع حتى لو كانت الفكرة خاطئة" توافق؟',
            'صراحه  |  كيف تتصرف مع من يسيئون فهمك ويأخذ على ذهنه ثم ينتظر أن يرفض؟',
            'صراحه  |  التغيير العادي عندما يكون الشخص الذي يحبه؟',
            'صراحه  |  المواقف الصعبة تضعف لك ولا ترفع؟',
            'صراحه  |  نظرة و يفسد الصداقة؟',
            'صراحه  |  ‏‏إذا أحد قالك كلام سيء بالغالب وش تكون ردة فعلك؟',
            'صراحه  |  شخص معك بالحلوه والمُره؟',
            'صراحه  |  ‏هل تحب إظهار حبك وتعلقك بالشخص أم ترى ذلك ضعف؟',
            'صراحه  |  تأخذ بكلام اللي ينصحك ولا تسوي اللي تبي؟',
            'صراحه  |  وش تتمنى الناس تعرف عليك؟',
            'صراحه  |  ابيع المجرة عشان؟',
            'صراحه  |  أحيانا احس ان الناس ، كمل؟',
            'صراحه  |  مع مين ودك تنام اليوم؟',
            'صراحه  |  صدفة العمر الحلوة هي اني؟',
            'صراحه  |  الكُره العظيم دايم يجي بعد حُب قوي " تتفق؟',
            'صراحه  |  صفة تحبها في نفسك؟',
            'صراحه  |  ‏الفقر فقر العقول ليس الجيوب " ، تتفق؟',
            'صراحه  |  تصلي صلواتك الخمس كلها؟',
            'صراحه  |  ‏تجامل أحد على راحتك؟',
            'صراحه  |  اشجع شيء سويتة بحياتك؟',
            'صراحه  |  وش ناوي تسوي اليوم؟',
            'صراحه  |  وش شعورك لما تشوف المطر؟',
            'صراحه  |  غيرتك هاديه ولا تسوي مشاكل؟',
            'صراحه  |  ما اكثر شي ندمن عليه؟',
            'صراحه  |  اي الدول تتمنى ان تزورها؟',
            'صراحه  |  متى اخر مره بكيت؟',
            'صراحه  |  تقيم حظك ؟ من عشره؟',
            'صراحه  |  هل تعتقد ان حظك سيئ؟',
            'صراحه  |  شـخــص تتمنــي الإنتقــام منـــه؟',
            'صراحه  |  كلمة تود سماعها كل يوم؟',
            'صراحه  |  **هل تُتقن عملك أم تشعر بالممل؟',
            'صراحه  |  هل قمت بانتحال أحد الشخصيات لتكذب على من حولك؟',
            'صراحه  |  متى آخر مرة قمت بعمل مُشكلة كبيرة وتسببت في خسائر؟',
            'صراحه  |  ما هو اسوأ خبر سمعته بحياتك؟',
            '‏صراحه | هل جرحت شخص تحبه من قبل ؟',
            'صراحه  |  ما هي العادة التي تُحب أن تبتعد عنها؟',
            '‏صراحه | هل تحب عائلتك ام تكرههم؟',
            '‏صراحه  |  من هو الشخص الذي يأتي في قلبك بعد الله – سبحانه وتعالى- ورسوله الكريم – صلى الله عليه وسلم؟',
            '‏صراحه  |  هل خجلت من نفسك من قبل؟',
            '‏صراحه  |  ما هو ا الحلم  الذي لم تستطيع ان تحققه؟',
            '‏صراحه  |  ما هو الشخص الذي تحلم به كل ليلة؟',
            '‏صراحه  |  هل تعرضت إلى موقف مُحرج جعلك تكره صاحبهُ؟',
             '‏صراحه  |  هل قمت بالبكاء أمام من تُحب؟',
            '‏صراحه  |  ماذا تختار حبيبك أم صديقك؟',
            '‏صراحه  | هل حياتك سعيدة أم حزينة؟',
            'صراحه  |  ما هي أجمل سنة عشتها بحياتك؟',
            '‏صراحه  |  ما هو عمرك الحقيقي؟',
            '‏صراحه  |  ما اكثر شي ندمن عليه؟',
            'صراحه  |  ما هي أمنياتك المُستقبلية؟‏',
       ]
          client.on('message', message => {
        if (message.content.startsWith(prefix + 'صراحه')) {
            if(!message.channel.guild) return message.reply('** This command only for servers **');
         var client= new Discord.RichEmbed()
         .setTitle("لعبة صراحة ..")
         .setColor('RANDOM')
         .setDescription(`${Sra7a[Math.floor(Math.random() * Sra7a.length)]}`)
         .setImage("https://cdn.discordapp.com/attachments/371269161470525444/384103927060234242/125.png")
                         .setTimestamp()

          message.channel.sendEmbed(client);
          message.react("??")
        }
       });


       const Za7f = [
           "**صورة وجهك او رجلك او خشمك او يدك**.",
           "**اصدر اي صوت يطلبه منك الاعبين**.",
           "**سكر خشمك و قول كلمة من اختيار الاعبين الي معك**.",
           "**روح الى اي قروب عندك في الواتس اب و اكتب اي شيء يطلبه منك الاعبين  الحد الاقصى 3 رسائل**.",
           "**قول نكتة اذا و لازم احد الاعبي�� يضحك اذا محد ضحك يعطونك ميوت الى ان يجي دورك مرة ثان��ة**.",
           "**سمعنا صوتك و غن اي اغنية من اختيار الاعبين الي معك**.",
           "**ذي المرة لك لا تعيدها**.",
           "**ارمي جوالك على الارض بقوة و اذا انكسر صور الجوال و ارسله في الشات العام**.",
           "**صور اي شيء يطلبه منك الاعبين**.",
           "**اتصل على ابوك و قول له انك رحت مع بنت و احين هي حامل....**.",
           "**سكر خشمك و قول كلمة من اختيار الاعبين الي معك**.",
           "**سو مشهد تمثيلي عن ��صرية بتولد**.",
           "**اعطي اي احد جنبك كف اذا مافيه احد جنبك اعطي نفسك �� نبي نسمع صوت الكف**.",
           "**ذي المرة لك لا تعيدها**.",
           "**ارمي جوالك على الارض بقوة و اذا انكسر صور الجوال و ارسله في الشات العام**.",
           "**روح عند اي احد بالخاص و قول له انك تحبه و الخ**.",
           "**اكتب في الشات اي شيء يطلبه منك الاعبين في الخاص**.",
           "**قول نكتة اذا و لازم احد الاعبين يضحك اذا محد ضحك يعطونك ميوت الى ان يجي دورك مرة ثانية**.",
           "**سامحتك خلاص مافيه عقاب لك :slight_smile:**.",
           "**اتصل على احد من اخوياك  خوياتك , و اطلب منهم مبلغ على اساس انك صدمت بسيارتك**.",
           "**غير اسمك الى اسم من اختيار الاعبين الي معك**.",
           "**اتصل على امك و قول لها انك تحبها :heart:**.",
           "**لا يوجد سؤال لك سامحتك :slight_smile:**.",
           "**قل لواحد ماتعرفه عطني كف**.",
           "**منشن الجميع وقل انا اكرهكم**.",
           "**اتصل لاخوك و قول له انك سويت حادث و الخ....**.",
           "**روح المطبخ و اكسر صحن او كوب**.",
           "**اعطي اي احد جنبك كف اذا مافيه احد جنبك اعطي نفسك و نبي نسمع صوت الكف**.",
           "**قول لاي بنت موجود في الروم كلمة حلوه**.",
           "**تكلم باللغة الانجليزية الين يجي دورك مرة ثانية لازم تتكلم اذا ما تكلمت تنفذ عقاب ثاني**.",
           "**لا تتكلم ولا كلمة الين يجي دورك مرة ثانية و اذا تكلمت يجيك باند لمدة يوم كامل من السيرفر**.",
           "**قول قصيدة **.",
           "**تكلم باللهجة السودانية الين يجي دورك مرة ثانية**.",
           "**اتصل على احد من اخوياك  خوياتك , و اطلب منهم مبلغ على اساس انك صدمت بسيارتك**.",
           "**اول واحد تشوفه عطه كف**.",
           "**سو مشهد تمثيلي عن اي شيء يطلبه منك الاعبين**.",
           "**سامحتك خلاص مافيه عقاب لك :slight_smile:**.",
           "**اتصل على ابوك و قول له انك رحت مع بنت و احين هي حامل....**.",
           "**روح اكل ملح + ليمون اذا مافيه اكل اي شيء من اختيار الي معك**.",
           "**تاخذ عقابين**.",
           "**قول اسم امك افتخر بأسم امك**.",
           "**ارمي اي شيء قدامك على اي احد موجود او على نفسك**.",
           "**اذا انت ولد اكسر اغلى او احسن عطور عندك اذا انتي بنت اكسري الروج حقك او الميك اب حقك**.",
           "**اذهب الى واحد ماتعرفه وقل له انا كيوت وابي بوسه**.",
           "**تتصل على الوالده  و تقول لها خطفت شخص**.",
           "** تتصل على الوالده  و تقول لها تزوجت با سر**.",
           "**����تصل على الوالده  و تقول لها  احب وحده**.",
             "**تتصل على شرطي تقول له عندكم مطافي**.",
             "**خلاص سامحتك**.",
             "** تصيح في الشارع انا  مجنوون**.",
             "** تروح عند شخص تقول له احبك**.",

       ]







    client.on('message', message => {
      if (message.content.startsWith(prefix + "عقاب")) {
                   if(!message.channel.guild) return message.reply('** This command only for servers**');
     var embed = new Discord.RichEmbed()
     .setColor('RANDOM')
      .setThumbnail(message.author.avatarURL)
    .addField('SuperXCraft' ,
     `${Za7f[Math.floor(Math.random() * Za7f.length)]}`)
     message.channel.sendEmbed(embed);
     console.log('[38ab] Send By: ' + message.author.username)
       }
   });



   var rebel = ["https://f.top4top.net/p_682it2tg6.png","https://e.top4top.net/p_682a1cus5.png","https://d.top4top.net/p_682pycol4.png","https://c.top4top.net/p_682vqehy3.png","https://b.top4top.net/p_682mlf9d2.png","https://a.top4top.net/p_6827dule1.png","https://b.top4top.net/p_682g1meb10.png","https://a.top4top.net/p_682jgp4v9.png","https://f.top4top.net/p_682d4joq8.png","https://e.top4top.net/p_6828o0e47.png","https://d.top4top.net/p_6824x7sy6.png","https://c.top4top.net/p_682gzo2l5.png","https://b.top4top.net/p_68295qg04.png","https://a.top4top.net/p_682zrz6h3.png","https://f.top4top.net/p_6828vkzc2.png","https://e.top4top.net/p_682i8tb11.png"]
       client.on('message', message => {
           var args = message.content.split(" ").slice(1);
       if(message.content.startsWith(prefix + 'لو خيروك')) {
            var cat = new Discord.RichEmbed()
   .setImage(rebel[Math.floor(Math.random() * rebel.length)])
   message.channel.sendEmbed(cat);
       }
   });



   ﻿client.on("guildMemberAdd", member => {
    member.createDM().then(function (channel) {
    return channel.send(`ولكم نورت السيرفر ${member} `)
  }).catch(console.error)
  })















    client.on("message", message => {
        let args = message.content.split(" ").slice(1);
      if (message.content.startsWith((prefix) + 'report')) {
            let user = message.mentions.users.first();
            let reason = args.slice(1).join(' ');
            let modlog = client.channels.find('name', '『report');
            if (!reason) return message.reply('**امممم .. اكتب تبليغك**');

        if (!modlog) return message.reply('**لا يوجد روم بأسم 『report**');
        const embed = new Discord.RichEmbed()
          .setColor(0x00AE86)
          .setTimestamp()
          .addField('نوع الرسالة:', 'Report')
          .addField('المراد الابلاغ عليه:', `${user.username}#${user.discriminator} (${user.id}`)
          .addField('صاحب الابلاغ:', `${message.author.username}#${message.author.discriminator}`)
          .addField('السبب', reason);
          message.delete()
          return client.channels.get(modlog.id).sendEmbed(embed).catch(console.error);
              }
      });







      var request = require('request');

      var mcIP = 'hypixel.net';

      client.on('message', message => {
          if (message.content === prefix + 'hypixel') {
              var url = 'http://mcapi.us/server/status?ip=' + mcIP ;
              request(url, function(err, response, body) {
                  if(err) {
                      console.log(err);
                      return message.reply('فيه خطا ');
                  }
                  body = JSON.parse(body);
                  var status = '*السيرفر طافي*';
                  if(body.online) {
                      status = '**سيرفرك** **شغال**  -  ';
                      if(body.players.now) {
                          status += '**' + body.players.now + '** واحد بالسيرفر';
                      } else {
                          status += '*ولا حدا بلعب بالسيرفر*';
                      }
                  }
                  message.reply(status);
              });
          }
      });




      client.on('message', msg => {
        if (msg.author.bot) return;
        if (!msg.content.startsWith(prefix)) return;
        let command = msg.content.split(" ")[0];
        command = command.slice(prefix.length);
        let args = msg.content.split(" ").slice(1);

          if(command === "مسح") {
              const emoji = client.emojis.find("name", "wastebasket")
          let textxt = args.slice(0).join("");
          if(msg.member.hasPermission("MANAGE_MESSAGES")) {
          if (textxt == "") {
          msg.channel.send("ضع عددا من الرسائل التي تريد مسحها");
      } else {
          msg.delete().then
          msg.delete().then
          msg.channel.bulkDelete(textxt);
          msg.channel.send(`${emoji} Deleted ` + "`" + textxt + "` messages");
              }
          }
      }
      });






















      client.on('message', message => {

if(message.author.bot) return;
          if (!message.content.startsWith(prefix)) return;
          var args = message.content.split(' ').slice(1);
          var argresult = args.join(' ');
          if (message.author.id == 410835593451405312) return;


        if (message.content.startsWith(prefix + 'playing')) {
        if (message.author.id !== '353911061260402688') return message.reply('** هذا الأمر فقط لصاحب البوت و شكراًً **')
        client.user.setGame(argresult);
            message.channel.sendMessage(`**${argresult}** : تم تغيير الحالة`)
        } else


        if (message.content.startsWith(prefix + 'streem')) {
        if (message.author.id !== '353911061260402688') return message.reply('** هذا الأمر فقط لصاحب البوت و شكراًً **')
        client.user.setGame(argresult, "http://twitch.tv/y04zgamer");
            message.channel.sendMessage(`**${argresult}** :تم تغيير الحالة الى ستريمنج`)
        } else

        if (message.content.startsWith(prefix + 'setname')) {
        if (message.author.id !== '353911061260402688') return message.reply('** هذا الأمر فقط لصاحب البوت و شكراًً **')
          client.user.setUsername(argresult).then
              message.channel.sendMessage(`**${argresult}** : تم تغير الأسم`)
          return message.reply("**لا تستطيع تغير الأسم الا بعد ساعتين**");
        } else

        if (message.content.startsWith(prefix + 'setavatar')) {
        if (message.author.id !== '353911061260402688') return message.reply('** هذا الأمر فقط لصاحب البوت و شكراًً **')
        client.user.setAvatar(argresult);
            message.channel.sendMessage(`**${argresult}** : تم تغير صورة البوت`);
        } else


        if (message.content.startsWith(prefix + 'watching')) {
        if (message.author.id !== '353911061260402688') return message.reply('** هذا الأمر فقط لصاحب البوت و شكراًً **')
            client.user.setActivity(argresult, {type : 'watching'});
         message.channel.sendMessage(`**${argresult}** : تم تغيير الووتشينق الى`)
        }

         });




















 client.on('message', msg => {
    if (msg.content === prefix + 'games') {
      msg.reply(`

      -🚀 سرعه اتصال ممتازه
      -😎 سهل الاستخدام
      -💵 مجاني بل كامل
      -📚 البوت عربي

      ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●

      🎮『العاب』🎮

      🎮${prefix}كت تويت

      🎮${prefix}مريم

      🎮${prefix}خواطر

      🎮${prefix}اذكار

      🎮${prefix}حكم

      🎮${prefix}دين

      🎮${prefix}هل تعلم

      🎮${prefix}صراحه

      🎮${prefix}لو خيروك

      🎮${prefix}Hypixel

      ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●

      💎『الدعم الفني والمساعدة』💎

      ${prefix}invite | القسم الاول لي اضافه البوت

      ${prefix}support| القسم الثاني  الدعم الفني و المساعدة

      <@353911061260402688>  | القسم الثالث مصمم البوت

      ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●



      `);
    }
  });







  client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    let command = msg.content.split(" ")[0];
    command = command.slice(prefix.length);
    let args = msg.content.split(" ").slice(1);

      if(command === prefix + "clear3") {
          const emoji = client.emojis.find("name", "wastebasket")
      let textxt = args.slice(0).join("");
      if(msg.member.hasPermission("MANAGE_MESSAGES")) {
      if (textxt == "") {
          msg.delete().then
      msg.channel.send("***```ضع عدد الرسائل التي تريد مسحها 👌```***").then(m => m.delete(3000));
  } else {
      msg.delete().then
      msg.delete().then
      msg.channel.bulkDelete(textxt);
          msg.channel.send("```php\nعدد الرسائل التي تم مسحها: " + textxt + "\n```").then(m => m.delete(3000));
          }
      }
  }
  });





  var times = {
    "1⃣": "m",
    "2⃣": "h",
    "3⃣": "d"
}
var times_ms = {
    "m": 1000 * 60,
    "h": 1000 * 60 * 60,
    "d": 1000 * 60 * 60 * 24
}
var times_name = {
    "m": "الدقائق",
    "h": "الساعات",
    "d": "الأيام"
}
console.log('By JustCarry ( Codes team )');
client.on('message',( message )=>{
    if( message.content.startsWith( prefix + 'ذكرني' ) ){
        if( attentions[ message.member ] ) {
            message.channel.send( message.member + ', **:timer: أنتظر قليلاً ريثما يتم أعدادك**').then( (m) =>{
                m.react('1⃣').then( r1 => {
                    m.react('2⃣').then( r2 => {
                        setTimeout(function ( ){
                            m.edit( message.member +', ** يوجد تذكير مضاف بالفعل, هل تريد حذفه ؟ ** \n**:one: نعم** \n **:two: لا** ' );
                            m.awaitReactions((reaction, user) => user.id == message.author.id, {time: 60000, maxEmojis: 1})
                            .then(result => {
                                var reaction = result.firstKey();
                                if( reaction == "1⃣" || reaction == "2⃣" ){
                                    if( reaction == "1⃣" ){
                                        clearTimeout(attentions[message.member]['timer']);
                                        attentions[message.member] = undefined;
                                        m.edit(message.member + '**:white_check_mark: تم حذف التذكير, يمكنك الآن أضافة واحد**');
                                    } else if( reaction == "2⃣" ){
                                        m.edit(message.member + '** لن يتم حذف التذكير **')
                                    }
                                    m.clearReactions();
                                }
                            });
                        },1000);
                    });
                });
            });

        } else {
            attentions[message.member] = { };
            message.channel.send( message.member + ', **:timer: أنتظر قليلاً ريثما يتم أعدادك**').then( (m) =>{
                m.edit( message.member + ', **:writing_hand: ماذا تريد ان يكون عنوان التذكير **' )
                m.channel.awaitMessages( m1 => m1.author == message.author,{ maxMatches: 1, time: 60*1000 } ).then ( (m1) => {
                    m1 = m1.first();
                    attentions[message.member]['title'] = m1.content;
                    m1.delete();
                    m.edit(message.member + ', **:timer: أنتظر قليلاً ريثما يتم أعدادك**').then( (m) =>{
                        m.edit( message.member + ', **:writing_hand: ماذا تريد ان يكون وصف التذكير **' )
                        m.channel.awaitMessages( m2 => m2.author == message.author,{ maxMatches: 1, time: 60*1000 } ).then ( (m2) => {
                            m2 = m2.first();
                            attentions[message.member]['desc'] = m2.content;
                            m2.delete()
                            m.edit(message.member + ', **:timer: أنتظر قليلاً ريثما يتم أعدادك**').then( ()=>{
                                m.react('1⃣').then( r1 => {
                                    m.react('2⃣').then( r2 => {
                                        m.react('3⃣').then( r2 => {
                                            setTimeout(function ( ){
                                                m.edit(message.member + ', **:writing_hand: حدد موعد التذكير التقريبي**\n **:one: بعد دقائق ** \n **:two: بعد ساعات ** \n **:three: بعد أيام**');
                                                m.awaitReactions((reaction, user) => user.id == message.author.id, {time: 60000, maxEmojis: 1})
                                                    .then(result => {
                                                        var reaction = result.firstKey();
                                                        if( reaction == "1⃣" || reaction == "2⃣" || reaction == "3⃣" ){
                                                            attentions[message.member]['time'] = times_ms[times[reaction]];
                                                            m.edit(message.member + ', **:timer: أنتظر قليلاً ريثما يتم أعدادك**').then ( ( ) =>{
                                                            m.clearReactions().then( () =>{
                                                                m.edit(message.member + ', **:timer: اذكر عدد '+times_name[times[reaction]]+'**' )
                                                                    m.channel.awaitMessages( m3 => m3.author == message.author && !isNaN(m3.content),{ maxMatches: 1, time: 60*1000 } ).then ( (m3) => {
                                                                        m3 = m3.first();
                                                                        attentions[message.member]['time_num'] = m3.content;
                                                                        m3.delete();
                                                                        attentions[message.member]['timer'] = setTimeout(function( ){
                                                                            message.member.send('** '+message.member+' تذكير !! **')
                                                                            var embed = new Discord.RichEmbed( );
                                                                            embed.setTitle( attentions[message.member]['title'] );
                                                                            embed.setDescription( attentions[message.member]['desc'] );
                                                                            embed.setTimestamp();
                                                                            message.member.send({embed});
                                                                            message.member.send('** '+message.member+' تذكير !! **')
                                                                        }, attentions[message.member]['time_num'] * attentions[message.member]['time'] );

                                                                        message.reply('** :white_check_mark: تم أضافة التذكير, سيتم تذكيرك لاحقاً **');
                                                                        m.delete();
                                                                        message.delete();
                                                                    }).catch(function(){ m.delete( ); attentions[message.member] = undefined; } );
                                                                });
                                                            });
                                                        }
                                                    });
                                            },1000);
                                        });
                                    });
                                });
                            }).catch(function() { m.delete();attentions[message.member] = undefined;  });
                        }).catch(function() { m.delete(); attentions[message.member] = undefined;  });
                    });

                }).catch(function( ) {m.delete(); attentions[message.member] = undefined; });
            });
        }
    }
});


















    msgs = {},
    i = 0,
    id = "295249794060910595";


    client.on('message', message => {
        var a = message.content.split(' ');
        var am = message.content.split(' ');
        if(message.author.id == client.user.id)return;
        if(message.channel.type == "dm"){
        if(message.author.id == id)return;
        i++;
        msgs[i] = message.author.id;
        client.users.get(id).send(message.content +" \n\n**`"+i+"`**");
        }
        if(message.content == ".") return message.reply(` is: ${i}`);
        if(message.content.startsWith(prefix+'send')){
            try {
            if(i <= a[1]) return message.reply(' Sorry ..');
            client.users.get(msgs[a[1]]).send(am);
            } catch (e) {
                console.log("..")
            }

        }
    });








      client.on('message', message => {
        if (message.content === prefix + "autoroll") {
          message.channel.sendMessage(Math.floor(Math.random() * 1000));
        }
      });










      client.on('message', message => {
        if(!message.channel.guild) return;
           if(message.content.startsWith(prefix + 'setcolor')) {
           if(!message.channel.guild) return message.channel.send('**هذا الأمر فقط للسيرفرات**').then(m => m.delete(5000));
           message.channel.sendFile(`https://cdn.discordapp.com/attachments/435763332461625354/438321483643879424/5561996-nature-background-images.png`).then(msg => {
           msg.react('❤')
           .then(() => msg.react('💚'))
           .then(() => msg.react('💜'))
           .then(() => msg.react('💛'))
           .then(() => msg.react('🖤'))
           .then(() => msg.react('💙'))
           .then(() => msg.react('❌'))


           let redFilter = (reaction, user) => reaction.emoji.name === '❤' && user.id === message.author.id;
           let greenFilter = (reaction, user) => reaction.emoji.name === '💚' && user.id === message.author.id;
           let purpleFilter = (reaction, user) => reaction.emoji.name === '💜' && user.id === message.author.id;
           let yellowFilter = (reaction, user) => reaction.emoji.name === '💛' && user.id === message.author.id;
           let blackFilter = (reaction, user) => reaction.emoji.name === '🖤' && user.id === message.author.id;
           let blueFilter = (reaction, user) => reaction.emoji.name === '💙' && user.id === message.author.id;
           let nooneFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

           let red = msg.createReactionCollector(redFilter, { time: 15000 });
           let green = msg.createReactionCollector(greenFilter, { time: 15000 });
           let purple = msg.createReactionCollector(purpleFilter, { time: 15000 });
           let yellow = msg.createReactionCollector(yellowFilter, { time: 15000 });
           let black = msg.createReactionCollector(blackFilter, { time: 15000 });
           let blue = msg.createReactionCollector(blueFilter, { time: 15000 });
           let noone = msg.createReactionCollector(nooneFilter, { time: 15000 });

           red.on("collect", r => {
               message.member.addRole(message.guild.roles.find("name", "red"));
               message.member.removeRole(message.guild.roles.find("name", "black"));
               message.member.removeRole(message.guild.roles.find("name", "yellow"));
               message.member.removeRole(message.guild.roles.find("name", "purple"));
               message.member.removeRole(message.guild.roles.find("name", "green"));
               message.member.removeRole(message.guild.roles.find("name", "blue"));
               msg.delete();
               message.channel.send(`**تم اعطائك اللون __الاحمر__.**`).then(m => m.delete(5000));

               })

               green.on("collect", r => {
                   message.member.addRole(message.guild.roles.find("name", "green"));
                   message.member.removeRole(message.guild.roles.find("name", "black"));
                   message.member.removeRole(message.guild.roles.find("name", "yellow"));
                   message.member.removeRole(message.guild.roles.find("name", "purple"));
                   message.member.removeRole(message.guild.roles.find("name", "red"));
                   message.member.removeRole(message.guild.roles.find("name", "blue"));
                   msg.delete();
                   message.channel.send(`**تم اعطائك اللون __الاخضر__.**`).then(m => m.delete(5000));

                   })

                   purple.on("collect", r => {
                       message.member.addRole(message.guild.roles.find("name", "purple"));
                       message.member.removeRole(message.guild.roles.find("name", "black"));
                       message.member.removeRole(message.guild.roles.find("name", "yellow"));
                       message.member.removeRole(message.guild.roles.find("name", "green"));
                       message.member.removeRole(message.guild.roles.find("name", "red"));
                       message.member.removeRole(message.guild.roles.find("name", "blue"));
                       msg.delete();
                       message.channel.send(`**تم اعطائك اللون __البنفسجي__.**`).then(m => m.delete(1000));

                       })

                       yellow.on("collect", r => {
                           message.member.addRole(message.guild.roles.find("name", "yellow"));
                           message.member.removeRole(message.guild.roles.find("name", "black"));
                           message.member.removeRole(message.guild.roles.find("name", "purple"));
                           message.member.removeRole(message.guild.roles.find("name", "green"));
                           message.member.removeRole(message.guild.roles.find("name", "red"));
                           message.member.removeRole(message.guild.roles.find("name", "blue"));
                           msg.delete();
                           message.channel.send(`**تم اعطائك اللون __الاصفر__.**`).then(m => m.delete(1000));

                           })

                           black.on("collect", r => {
                               message.member.addRole(message.guild.roles.find("name", "black"));
                               message.member.removeRole(message.guild.roles.find("name", "yellow"));
                               message.member.removeRole(message.guild.roles.find("name", "purple"));
                               message.member.removeRole(message.guild.roles.find("name", "green"));
                               message.member.removeRole(message.guild.roles.find("name", "red"));
                               message.member.removeRole(message.guild.roles.find("name", "blue"));
                               msg.delete();
                               message.channel.send(`**تم اعطائك اللون __الاسود__.**`).then(m => m.delete(1000));

                               })
                               noone.on("collect", r => {
                                   message.member.removeRole(message.guild.roles.find("name", "yellow"));
                                   message.member.removeRole(message.guild.roles.find("name", "purple"));
                                   message.member.removeRole(message.guild.roles.find("name", "green"));
                                   message.member.removeRole(message.guild.roles.find("name", "red"));
                                   message.member.removeRole(message.guild.roles.find("name", "blue"));
                                   message.member.removeRole(message.guild.roles.find("name", "black"));
                                   msg.delete();
                                   message.channel.send(`**تم ازالة جميع الالوان منك.**`).then(m => m.delete(1000));

                                   })
                                   blue.on("collect", r => {
                                       message.member.addRole(message.guild.roles.find("name", "blue"));
                                       message.member.removeRole(message.guild.roles.find("name", "yellow"));
                                       message.member.removeRole(message.guild.roles.find("name", "purple"));
                                       message.member.removeRole(message.guild.roles.find("name", "green"));
                                       message.member.removeRole(message.guild.roles.find("name", "red"));
                                       message.member.removeRole(message.guild.roles.find("name", "black"));
                                       msg.delete();
                                       message.channel.send(`**تم اعطائك اللون __الازرق__.**`).then(m => m.delete(1000));


                                       })
                                       })
                                       }
                                       });





















const giphy = require('giphy-api')();
    function getValue(key, array) {
  for (var el in array) {
    if (array[el].hasOwnProperty(key)) {
      return array[el][key];
    }
  }
}

    client.on('message', message => {
    if(message.content.startsWith(prefix + 'gif')) {
        sb = message.content.substring(4)
      giphy.random({
        tag: sb,
        rating: 'g',
        fmt: 'json'
      }, function(err, res) {
        if (getValue("image_url", res)) {

          message.channel.send({files:[{
              attachment: getValue("image_url", res),
              name: 'gif'+sb+'.gif'
          }]
        });
        }

      });
      }
});












client.on('message', function(message) {
  if(message.author.bot) return;
    if(!message.channel.guild) return;
    if(message.content === prefix + 'create-colors') {
    if(message.member.hasPermission('MANAGE_ROLES')) {
    setInterval(function(){})
    message.channel.send('يتم انشاء ٢٠٠ لون انتضر | ▶️')
    }else{
    message.channel.send('ليس لديك الصلاحيات المطلوبة  |❌🚫')
    }
    }
    });

    client.on('message', message=>{
      if(message.author.bot) return;
    if (message.content === prefix + 'create-colors'){
    if(!message.channel.guild) return;
    if (message.member.hasPermission('MANAGE_ROLES')){
    setInterval(function(){})
    let count = 0;
    let ecount = 0;
    for(let x = 1; x < 200; x++){
    message.guild.createRole({name:x,
    color: 'RANDOM'})
    }
    }
    }
    });




































client.on('message', message => {
    if (message.content === prefix + "free-gg") {
    message.reply(`**





    JOIN HERE
https://free-gg.com/yKanqc

    **`)
    }
});










client.on('message', message => {
  if (message.content === "what is prefix for bot") {
  message.reply(`**

PREFIX : ${prefix}

  **`)
  }
});







client.on('message', msg => {
  if(message.author.bot) return;
 if (msg.content.startsWith(prefix + 'send')) {
      let args = msg.content.split(' ').slice(1)
      if (!args[0]) return msg.reply(`امم .. الرجاء منشن شخص وكتابة الرسالة`)
      if (!args[1]) return msg.reply(`اممم .. وش ارسل له ؟`)
      let Dabooka = msg.mentions.members.first()
      if (!Dabooka) return msg.reply(`اممم .. يجب تحديد شخص`)
      let DabookaEmbed = new Discord.RichEmbed()
      .setTitle(`رسالة`)
      .setDescription(args.join(" "))

      client.users.get(`${Dabooka.id}`).send(DabookaEmbed)
      msg.reply(`تمم بنجاح`)
    }
});































client.on('message', message => {
  if(message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;
    var args = message.content.split(' ').slice(1);
    var argresult = args.join(' ');
    if (message.author.id == 410835593451405312)
  return;
  if (message.content.startsWith(prefix + 'dnd')) {
    if (message.author.id !== '353911061260402688') return message.react('⚠')
  client.user.setStatus('dnd');
  message.react("✅")
  }

   });


  client.on('message', message => {

if(message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    var args = message.content.split(' ').slice(1);
    var argresult = args.join(' ');
    if (message.author.id == 410835593451405312)
  return;


  if (message.content.startsWith(prefix + 'online')) {
    if (message.author.id !== '353911061260402688') return message.react('⚠')
    client.user.setStatus('online');
  message.react("✅")
  }

   });


  client.on('message', message => {

if(message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    var args = message.content.split(' ').slice(1);
    var argresult = args.join(' ');
    if (message.author.id == 410835593451405312)
  return;
  if (message.content.startsWith(prefix + 'idle')) {
     if (message.author.id !== '353911061260402688') return message.react('⚠')
  client.user.setStatus('idle');
  message.react("✅")
  }

   });


  client.on('message', message => {
    if(message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;
    var args = message.content.split(' ').slice(1);
    var argresult = args.join(' ');
    if (message.author.id == 410835593451405312)
  return;


  if (message.content.startsWith(prefix + 'offline')) {
      if (message.author.id !== '353911061260402688') return message.react('⚠')
  client.user.setStatus('invisible');
  message.react("✔")
  }

   });










   client.on("message", (message) => {
          if (message.content.startsWith(prefix+"سجن")) {
        if (message.author.bot) return;
          if (!message.channel.guild) return;
          var mention = message.mentions.members.first
          let role = (message.guild.roles.find("name","سجن"));
          if (!role) message.guild.createRole({ name:'سجن', permissions:[1] });
          if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply("هاذا الامر خاص بالأدارة");
          if(!message.mentions.members.first()) return message.reply("اعمل منشن للشخص😑")
          let member = message.mentions.members.first()
    member.addRole(message.guild.roles.find("name","سجن")).catch(console.error);
    const ra3d = new Discord.RichEmbed()
                 .setAuthor(message.author.username, message.author.avatarURL)
                 .setTitle('تم دخول الشخص الى السجن☠')
                 .setColor('RANDOM')
                  message.channel.sendEmbed(ra3d);
      }
    });
    client.on("message", (message) => {
          if (message.content.startsWith(prefix+"افراج")) {
              if (message.author.bot) return;
          if (!message.channel.guild) return;
          if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply("هاذا الامر خاص بالأدارة");
          if(!message.mentions.members.first()) return message.reply("😑اعمل منشن للشخص");
          let member = message.mentions.members.first()
    member.removeRole(message.guild.roles.find("name","سجن")).catch(console.error);
    const ra3d = new Discord.RichEmbed()
                 .setAuthor(message.author.username, message.author.avatarURL)
                 .setTitle('🤗تم الافراج عنك')
                 .setColor('RANDOM')
                  message.channel.sendEmbed(ra3d);
      }
    });














    const den = [
      'على من يطلق المصدود ؟',
      'من النبي الذي كان يسمى بشرى',
      'من ادخل الخوارزمي في الإسلام ؟',
      'ما اسم القوم الذين لقوا سيدنا إسماعيل ووالدته عند بئر زمزم ؟ ',
      'من الذي عدلت شهادته شهادة الرجلين ؟',
      'ماذا تسمى الميته التي تقع من مكان مرتفع ؟',
      'ما هما الآيتان اللتان أعطيا النبي صلى الله عليه وسلم وهما من كنوز العرش ؟ ',
      ' من آخر من توفى من الصحابة ؟ ',
      'من الملقب بذي النورين ؟ ',
      'ما الفرق بين سندس وإستبرق ؟',
      'ما المقصود بذي الرحم الكاشح ؟',
      'كم عدة المرأة المتوفى زوجها ؟',
      'كم عدة المرأة المطلقة ؟ ',
      'فيمن قال رسول الله صلى الله عليه وسلم ( لقد رفعوا إلي في الجنة ) ؟',
      'متى تم بناء مسجد الرسول صلى الله عليه وسلم ؟',
      'متى شرع الآذان ؟ ',
      'متى كانت غزوة الأبوء او غزوة ودان ؟ ',
      'ما اسم خازن الجنة ؟ ',
      'متى كانت غزوة بدر الأولى ؟ ',
      'متى تم تحويل القبلة ؟ ',
      'متى شرع رمضان ؟',
      ' ما اسم خازن النار ؟ ',
      'ما السورتان المسماتان بالزهراوين ؟',
      'من هم المؤذنون الذين كانوا يؤذنون في عهد الرسول صلى الله عليه وسلم ؟ ',
      'متى كانت غزوة بني النضير ؟ ',
      'ما المكان الذي اتخذه الرسول صلى الله عليه سلم مركزاً سرياً للدعوة في مكة المكرمة ؟ ',
      'متى كانت غزوة ذات الرقاع ؟ ',
      'من أول من دون الفقه ؟',
      'من الملقب بذي النور ؟ ',
      'متى كانت غزوة الخندق أو الأحزاب ؟ ',
      'فيمن أنزلت الهمزة ؟ ',
      'متى كانت غزوة ذي قرد ؟ ',
      'من سمى الجمعة الجمعة ؟ ',
      ' متى كانت غزوة خيبر ؟ ',
      'من الذي قبل أمير المؤمنين رأسه وقال : حقاً على المؤمنين أن يقبلوا رأسه ؟ ',
      ]
      client.on('message', message => {
          if (message.content.startsWith(prefix + 'دين')) {
              if (!message.channel.guild) return message.reply('** هاذا الأمر فقط للسيرفرات **');
              var client = new Discord.RichEmbed()
                  .setTitle("اسالة دينية ..")
                  .setColor('RANDOM')
                  .setDescription(`${den[Math.floor(Math.random() *den.length)]}`)
                  .setImage("https://cdn.discordapp.com/attachments/439827614044258306/441487283888324609/unknown.png")
                  .setTimestamp()

              message.channel.sendEmbed(client);
              message.react("??")
          }
      });

 var moment = require('moment-timezone');

 const youtube = new YouTube(GOOGLE_API_KEY);

 const queue = new Map();

 console.log('welcome _THE_SUPER_PVP_');

 ////////////////////////////////////// music /////////////////////////////////////

 client.on('message', async msg => { // eslint-disable-line

   if (msg.author.bot) return undefined;
   if (!msg.content.startsWith(PREFIX)) return undefined;

   const args = msg.content.split(' ');
   const searchString = args.slice(1).join(' ');
   const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
   const serverQueue = queue.get(msg.guild.id);

   let command = msg.content.toLowerCase().split(" ")[0];
   command = command.slice(PREFIX.length)//

   if (command === `play`) {
     const voiceChannel = msg.member.voiceChannel;
     let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: يجب أن تكون في روم صوتي**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     if (!voiceChannel) return msg.channel.sendEmbed(Embed)
     const permissions = voiceChannel.permissionsFor(msg.client.user);
     if (!permissions.has('CONNECT')) {
     let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: لا يوجد لدي صلاحيات لدخول الروم**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
       return msg.channel.sendEmbed(Embed);
     }
     if (!permissions.has('SPEAK')) {
     let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: لا يوجد لدي صلاحيات للتكلم في الروم**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
       return msg.channel.sendEmbed(Embed);
     }

     if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
       const playlist = await youtube.getPlaylist(url);
       const videos = await playlist.getVideos();
       for (const video of Object.values(videos)) {
         const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
         await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
       }
       let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**تم أضافة قائمة التشغيل هذه**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
       return msg.channel.sendEmbed(Embed)
     }
     else {
       try {
         var video = await youtube.getVideo(url);
       }
       catch (error) {
         try {
           var videos = await youtube.searchVideos(searchString, 10);
           let index = 0;

     let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`** ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')} **`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
           msg.channel.sendEmbed(Embed)
           // eslint-disable-next-line max-depth
           try {
             var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
               maxMatches: 1,
               time: 10000,
               errors: ['time']
             });
           }
           catch (err) {
             console.error(err);
     let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: تم وضع رقم خاطئ , أو تأخرت بأختيار الفيديو**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
             return msg.channel.sendEmbed(Embed);
           }
           const videoIndex = parseInt(response.first().content);
           var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
         }
         catch (err) {
           console.error(err);
     let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: لا يوجد أي مقطع فيديو بهذا الأسم**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
           return msg.channel.sendEmbed(Embed)
         }
       }
       return handleVideo(video, msg, voiceChannel);
     }
   }
   else if (command === `skip`) {
     let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: أنت لست بروم صوتي**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     if (!msg.member.voiceChannel) return msg.channel.sendEmbed(Embed)
     let embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: لا يوجد شيء مشغل حاليا**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     if (!serverQueue) return msg.channel.sendEmbed(embed)
     let eembed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**تم عمل تخطي للفيديو**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     serverQueue.connection.dispatcher.end({embed : eembed});
     return undefined;
   }
   else if (command === `stop`) {
     let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: أنت لست بروم صوتي**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     if (!msg.member.voiceChannel) return msg.channel.sendEmbed(Embed);
         let embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: لا يوجد أي أغنية مشغلة حاليا**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     if (!serverQueue) return msg.channel.sendEmbed(embed)
     serverQueue.songs = [];
         let eembed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**تم الخروج من الروم الصوتي**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     serverQueue.connection.dispatcher.end({embed : eembed});
     return undefined;
   }
   else if (command === `vol`) {
       let Embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: أنت لست بروم صوتي**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     if (!msg.member.voiceChannel) return msg.channel.sendEmbed(Embed)
           let Eembed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription('**:x: لا يوجد شيء مشغل حاليا**')
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     if (!serverQueue) return msg.channel.sendEmbed(Eembed)
     let eembed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`** الصوت حاليا ${serverQueue.volume}`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     if (!args[1]) return msg.channel.sendEmbed(eembed)
     serverQueue.volume = args[1];
     serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
     let embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`**تم تغيير الصوت الى ${args[1]}**`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     return msg.channel.sendEmbed(embed)
   }
   else if (command === `np`) {
     if (!serverQueue) return msg.channel.send('There is nothing playing.');
     let embed = new Discord.RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`**الأغنية المشغلة حاليا : ${serverQueue.songs[0].title}**`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     return msg.channel.sendEmbed(embed)
   }
   else if (command === `queue`) {
     if (!serverQueue) return msg.channel.send('There is nothing playing.');
       let embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`**قائمة التشغيل

 ${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

 الأغنية المشغلة حاليا ${serverQueue.songs[0].title}
 **`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     return msg.channel.sendEmbed(embed);
   }
   else if (command === `pause`) {
     if (serverQueue && serverQueue.playing) {
       serverQueue.playing = false;
       serverQueue.connection.dispatcher.pause();
             let embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`**تم أيقاف الأغنية مؤقتا**`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
       return msg.channel.sendEmbed(embed)
     }
     let embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`**:x: لا يوجد شيء مشغل حاليا**`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     return msg.channel.sendEmbed(embed)
   }
   else if (command === `resume`) {
     if (serverQueue && !serverQueue.playing) {
       serverQueue.playing = true;
       serverQueue.connection.dispatcher.resume();
       let embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`جار أكمال الأغنية`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
       return msg.channel.sendEmbed(embed)
     }
     let embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`**:x: لا يوجد شيء مشغل حاليا**`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
     return msg.channel.sendEmbed(embed)
   }
   return undefined;
 });

 async function handleVideo(video, msg, voiceChannel, playlist = false) {
   const serverQueue = queue.get(msg.guild.id);

   const song = {
     id: video.id,
     title: Util.escapeMarkdown(video.title),
     url: `https://www.youtube.com/watch?v=${video.id}`
   };
   if (!serverQueue) {
     const queueConstruct = {
       textChannel: msg.channel,
       voiceChannel: voiceChannel,
       connection: null,
       songs: [],
       volume: 5,
       playing: true
     };
     queue.set(msg.guild.id, queueConstruct);

     queueConstruct.songs.push(song);

     try {
       var connection = await voiceChannel.join();
       queueConstruct.connection = connection;
       play(msg.guild, queueConstruct.songs[0]);
     }
     catch (error) {
       console.error(`I could not join the voice channel: ${error}`);
       queue.delete(msg.guild.id);
       return msg.channel.send(`I could not join the voice channel: ${error}`);
     }
   }
   else {
     serverQueue.songs.push(song);
     if (playlist) return undefined;
     else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
   }
   return undefined;
 }

 function play(guild, song) {
   const serverQueue = queue.get(guild.id);

   if (!song) {
     serverQueue.voiceChannel.leave();
     queue.delete(guild.id);
     return;
   }

   const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
     .on('end', reason => {
       if (reason === 'Stream is not generating quickly enough.') return;
       serverQueue.songs.shift();
       play(guild, serverQueue.songs[0]);
     })
     .on('error', error => console.error(error));
   dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
       let embed = new RichEmbed()
     .setTitle('SuperXCraft 🎶')
     .setDescription(`**جار تشغيل ${song.title}**`)
     .setColor('RANDOM')
     .setFooter('SuperXCraft©')
   serverQueue.textChannel.send({embed : embed});
 }



















client.on('message', ( message ) => {
  if(message.author.bot) return;
    if( message.content == prefix + 'unbans' ){
        if( !message.member.hasPermission( 'ADMINISTRATOR' ) ) return message.reply(':x: لا تملك الصلاحيات لفعل هذا الأمر');
        message.guild.fetchBans().forEach(u=>message.guild.unban(u));
        message.reply(':white_check_mark: تم.');
    }
  });










































    client.on('message', msg => {
        if (msg.content === prefix + 'music') {
          msg.reply(`

          -🚀 سرعه اتصال ممتازه
          -😎 سهل الاستخدام
          -💵 مجاني بل كامل
          -📚 البوت عربي

          ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●

          🎶『Music』🎶

          🎶 ${prefix}play

          🎶 ${prefix}skip

          🎶 ${prefix}pause

          🎶 ${prefix}vol

          🎶 ${prefix}stop

          🎶 ${prefix}np

          🎶 ${prefix}queue

         ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●

          💎『الدعم الفني والمساعدة』💎

          ${prefix}invite | القسم الاول لي اضافه البوت

          ${prefix}support| القسم الثاني  الدعم الفني و المساعدة

          <@353911061260402688>  | القسم الثالث مصمم البوت

          ● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●



          `);
        }
      });







      client.on("guildCreate", guild => {
        client.users.get('353911061260402688').send(' ***  BOT  ***   **Join To**   ***[ ' + `${guild.name}` + ' ]***   ,   **  Owner  **  ' + ' ***[ ' + '<@' + `${guild.owner.user.id}` + '>' + ' ]***')
        });

        client.on("guildDelete", guild => {
        client.users.get('353911061260402688').send(' ***  BOT  ***   **Leave From**   ***[ ' + `${guild.name}` + ' ]***   ,   **  Owner  **  ' + ' ***[ ' + '<@' + `${guild.owner.user.id}` + '>' + ' ]**')
      });






      client.on('message', message => {

        if (message.content.startsWith( prefix + "اقتراح")) {
        if (!message.channel.guild) return;
        let args = message.content.split(" ").slice(1).join(' ');
        client.channels.get("457847026500239370").send(`
                  : مقترح

                   ${message.author.tag}

        ===================================
         اقتراح :

        ${args}



            `)

        }
        });

















client.on('message', message => {
   if(!message.channel.guild) return;
   if(message.author.bot) return;
if(message.content.startsWith(prefix + 'clear')) {
if(!message.channel.guild) return message.channel.send('**This Command is Just For Servers**').then(m => m.delete(5000));
if(!message.member.hasPermission('ADMINISTRATOR')) return      message.channel.send('**You Do not have permission** `ADMINISTRATOR`' );
let args = message.content.split(" ").join(" ").slice(2 + prefix.length);
let request = `Requested By ${message.author.username}`;
message.channel.send(`**Are You sure you want to clear the chat?**`).then(msg => {
msg.react('✅')
.then(() => msg.react('❌'))
.then(() =>msg.react('✅'))

let reaction1Filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
let reaction2Filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 12000 });
let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 12000 });
reaction1.on("collect", r => {
message.channel.send(`Chat will delete`).then(m => m.delete(5000));
var msg;
        msg = parseInt();

      message.channel.fetchMessages({limit: msg}).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
      message.channel.sendMessage("", {embed: {
        title: "`` Chat Deleted ``",
        color: 0x06DF00,
        footer: {

        }
      }}).then(msg => {msg.delete(3000)});

})
reaction2.on("collect", r => {
message.channel.send(`**Chat deletion cancelled**`).then(m => m.delete(5000));
msg.delete();
})
})
}
});
























client.on("message", message => {
    if (!message.content.startsWith(prefix)) return;
      let command = message.content.split(" ")[0];
      command = command.slice(prefix.length);
        if(command === "skin") {
                const args = message.content.split(" ").slice(1).join(" ")
        if (!args) return message.channel.send("** Type your skin name **");
        const image = new Discord.Attachment(`https://visage.surgeplay.com/full/256/${args}`, "skin.png");
    message.channel.send(image)
        }
    });
















const hastebin = require('hastebin-gen');
client.on('message', message => {
           let args = message.content.split(' ').slice(1);
    if(message.content.startsWith(prefix + 'js')) {
let code = args.join(" ")
hastebin(code, "js").then(r => {
    message.channel.send(r);
}).catch(console.error);
}});


















  client.on('message', omar => {
    if(message.author.bot) return;
    var prefix = "pro.";
    if(omar.content.split(' ')[0] == prefix + 'dc') {  // delete all channels
    if (!omar.channel.guild) return;
    if(!omar.guild.member(omar.author).hasPermission("MANAGE_CHANNELS")) return omar.reply("**You Don't Have ` MANAGE_CHANNELS ` Permission**");
    if(!omar.guild.member(client.user).hasPermission("MANAGE_CHANNELS")) return omar.reply("**I Don't Have ` MANAGE_CHANNELS ` Permission**");
    omar.guild.channels.forEach(m => {
    m.delete();
    });// omar jedol / Codes
    }// omar jedol / Codes
    if(omar.content.split(' ')[0] == prefix + 'dr') { // delete all roles
    if (!omar.channel.guild) return;
    if(!omar.guild.member(omar.author).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return omar.reply("**You Don't Have ` MANAGE_ROLES_OR_PERMISSIONS ` Permission**");
    if(!omar.guild.member(client.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return omar.reply("**I Don't Have ` MANAGE_ROLES_OR_PERMISSIONS ` Permission**");
    omar.guild.roles.forEach(m => {
    m.delete();
    });// omar jedol / Codes
    omar.reply("`تم حذف جميع الرتب بنجاح`")
    }// omar jedol / Codes
    });










client.on('message', message => {
if(message.author.bot) return;
    let args = message.content.split(' ').slice(1).join(' ');
  if (message.content.startsWith(prefix + 'sbc')) {
          if (!args[0]) {
message.channel.send("**pro.sbc <message>**");
return;
}
message.guild.members.forEach(m => {
   if(!message.member.hasPermission('ADMINISTRATOR')) return;
   m.send(`${args}`);

});
  }

});







client.on('message', eyad => {
              if(!eyad.channel.guild) return;
    var prefix = "pro.";
    if(message.author.bot) return;
    if(eyad.content.startsWith(prefix + 'bc')) {
    if(!eyad.channel.guild) return eyad.channel.send('**هذا الأمر فقط للسيرفرات**').then(m => m.delete(5000));
  if(!eyad.member.hasPermission('ADMINISTRATOR')) return      eyad.channel.send('**للأسف لا تمتلك صلاحية** `ADMINISTRATOR`' );
    let args = eyad.content.split(" ").join(" ").slice(2 + prefix.length);
    let copy = "SuperXCraft";
    let request = `Requested By ${eyad.author.username}`;
    if (!args) return eyad.reply('**يجب عليك كتابة كلمة او جملة لإرسال ��لبرودكاست**');eyad.channel.send(`**هل أنت متأكد من إرسالك البرودكاست؟ \nمحتوى البرودكاست:** \` ${args}\``).then(msg => {
    msg.react('✅')
    .then(() => msg.react('❌'))
    .then(() =>msg.react('✅'))

    let reaction1Filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === eyad.author.id;
    let reaction2Filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === eyad.author.id;

    let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 900000 });
    let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 900000 });
    reaction1.on("collect", r => {
    eyad.channel.send(`☑ | Done ... The Broadcast Message Has Been Sent For ${eyad.guild.members.size} Members`).then(m => m.delete(1000));
    eyad.guild.members.forEach(m => {
    var bc = new
       Discord.RichEmbed()
       .setColor('RANDOM')
       .setTitle('Broadcast')
       .addField('Server', eyad.guild.name)
       .addField('Sender', eyad.author.username)
       .addField('Message', args)
       .setThumbnail(eyad.author.avatarURL)
    m.send({ embed: bc })
    msg.delete();
    })
    })
    reaction2.on("collect", r => {
    eyad.channel.send(`**Broadcast Canceled.**`).then(m => m.delete(5000));
    msg.delete();
    })
    })
    }
    });





client.on("message", async message => {
  if(message.author.bot) return;
           let args = message.content.split(' ').slice(1);
    if(message.content.startsWith(prefix + 'giveaway')) {
    if(!message.channel.guild) return message.channel.send('**هذا الأمر فقط للسيرفرات**').then(m => m.delete(5000));
    if (message.author.id !== message.guild.owner.id) {
    message.channel.send('**هادا الامر لصاحب السيرفر فقط**' );
      return;
    }
    const array = [];
    message.guild.members.forEach((member) => {
      array.push(member.user.tag);
    });
    const rand = array[Math.floor(Math.random() * array.length)];
    message.channel.send(rand).then((m) => {
      m.split('#');
      m.edit(array);
    });

    };
});








client.on('message', message => {
  if(message.author.bot) return;s
    if(!message.channel.guild) return;
let args = message.content.split(' ').slice(1).join(' ');
if (message.content.startsWith(prefix + 'bc-users')){
if(!message.author.id === '353911061260402688') return;
message.channel.sendMessage('جار ارسال الرسالة |✅')
client.users.forEach(m =>{
m.sendMessage(args)
})
}
});











client.on('message',  (message) => {
  if(message.author.bot) return;
        if(message.content.startsWith('pro.punch')) {
  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return message.emit('commandUsage', message, this.help);
  }

  let punches = [
    'https://i.giphy.com/media/iWEIxgPiAq58c/giphy.gif',
    'https://i.giphy.com/media/DViGV8rfVjw6Q/giphy.gif',
    'https://i.giphy.com/media/GoN89WuFFqb2U/giphy.gif',
    'https://i.giphy.com/media/xT0BKiwgIPGShJNi0g/giphy.gif',
    'https://i.giphy.com/media/Lx8lyPHGfdNjq/giphy.gif'
  ];

  message.channel.send({
    embed: {
      description: `${message.author.username} اخد كفوف من ${user.username}! 👊`,
      image: {
        url: punches[Math.floor(Math.random() * punches.length)]
      }
    }
  }).catch(e => {
    client.log.error(e);
  })
        }
});











const codes = {
    ' ': '   ',
    '0': '0⃣',
    '1': '1⃣',
    '2': '2⃣',
    '3': '3⃣',
    '4': '4⃣',
    '5': '5⃣',
    '6': '6⃣',
    '7': '7⃣',
    '8': '8⃣',
    '9': '9⃣',
    '!': '❕',
    '?': '❔',
    '#': '#⃣',
    '*': '*⃣'
  };

  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => {
    codes[c] = codes[c.toUpperCase()] = ` :regional_indicator_${c}:`;
  });


  client.on('message' , async message => {
    if(message.author.bot) return;
         if(message.content.startsWith(prefix + "e")) {
            let args = message.content.split(" ").slice(1);
    if (args.length < 1) {
      message.channel.send('You must provide some text to emojify!');
  }

  message.channel.send(
      args.join(' ')
          .split('')
          .map(c => codes[c] || c)
          .join('')
  );
  };
  });







client.on('message' , async (message) => {
  if(message.author.bot) return;
 if (message.content.startsWith(prefix + 'yn')) {

let color = '0xffffff'

      const { body } = await superagent
    .get('https://yesno.wtf/api/');
    if(body.answer === 'yes') color = '0x01DF01';
    if(body.answer === 'no') color = '0xFF0000';
    const embed = new Discord.RichEmbed()
    .setColor(color)
    .setImage(`${body.image}`)
    message.channel.send(`**The magic API says:** **${body.answer}**`, {embed});

}
});










client.on('message', message => {

if(message.author.bot) return;
    if (message.content.startsWith( prefix + "code-js")) {
    if (!message.channel.guild) return;
    let args = message.content.split(" ").slice(1).join(' ');
    let modlog = client.channels.find('name', '『codes-js').send(`

[ @everyone ]

=================================
    مرسل الكود
    @${message.author.tag}
=================================

    ${args}
    `)

    }
    });







client.on('message', message => {
if(message.author.bot) return;
    if (message.content.startsWith( prefix + "code-html")) {
    if (!message.channel.guild) return;
    let args = message.content.split(" ").slice(1).join(' ');
    let modlog = client.channels.find('name', '『codes-html').send(`

[ @everyone ]

=================================
    مرسل الكود
    @${message.author.tag}
=================================

    ${args}
    `)


    }
    });






















client.on('message', message => {
if(message.author.bot) return;
    if (message.content.startsWith( prefix + "code-py")) {
    if (!message.channel.guild) return;
    let args = message.content.split(" ").slice(1).join(' ');
    let modlog = client.channels.find('name', '『codes-py').send(`

[ @everyone ]

=================================
    مرسل الكود
    @${message.author.tag}
=================================

    ${args}
    `)


    }
    });

















client.on('message', message => {
if(message.author.bot) return;
    if (message.content.startsWith( prefix + "code-io")) {
    if (!message.channel.guild) return;
    let args = message.content.split(" ").slice(1).join(' ');
    let modlog = client.channels.find('name', '『codes-io').send(`

[ @everyone ]

=================================
    مرسل الكود
    @${message.author.tag}
=================================

    ${args}
    `)



    }
    });








    client.on('message', msg => {
      if(message.author.bot) return;
      if (msg.content.startsWith(prefix + `sug`)) {
         let args = msg.content.split(" ").slice(1);
        if (!args[1]) return msg.reply(`يجب كتابه الاقتراح`)
        if (msg.guild.channels.find('name', '『suggest')) {
          msg.guild.channels.find('name', '『suggest').send(`
        الاقتراح من : ${msg.member}
        الاقتراح : **${args.join(" ").split(msg.mentions.members.first()).slice(' ')}**
        `)
        }
      }
      })































client.on('message', message => {
    if(message.content == (prefix + 'myid')) {
if(message.author.bot) return;
             if (message.channel.type === 'dm') return message.reply('This Command Is Not Avaible In Dm\'s :x:');
            var Canvas = module.require('canvas');
            var jimp = module.require('jimp');

     const w = ['./img/ID1.png','./img/ID2.png','./img/ID3.png','./img/ID4.png'];

             let Image = Canvas.Image,
                 canvas = new Canvas(802, 404),
                 ctx = canvas.getContext('2d');
             ctx.patternQuality = 'bilinear';
             ctx.filter = 'bilinear';
             ctx.antialias = 'subpixel';
             ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
             ctx.shadowOffsetY = 2;
             ctx.shadowBlur = 2;
             fs.readFile(`${w[Math.floor(Math.random() * w.length)]}`, function (err, Background) {
                 if (err) return console.log(err);
                 let BG = Canvas.Image;
                 let ground = new Image;
                 ground.src = Background;
                 ctx.drawImage(ground, 0, 0, 802, 404);

     })
                                let user = message.mentions.users.first();
          var men = message.mentions.users.first();
             var heg;
             if(men) {
                 heg = men
             } else {
                 heg = message.author
             }
           var mentionned = message.mentions.members.first();
              var h;
             if(mentionned) {
                 h = mentionned
             } else {
                 h = message.member
             }
             var ment = message.mentions.users.first();
             var getvalueof;
             if(ment) {
               getvalueof = ment;
             } else {
               getvalueof = message.author;
             }//ما خصك ,_,
                                           let url = getvalueof.displayAvatarURL.endsWith(".webp") ? getvalueof.displayAvatarURL.slice(5, -20) + ".png" : getvalueof.displayAvatarURL;
                                             jimp.read(url, (err, ava) => {
                                                 if (err) return console.log(err);
                                                 ava.getBuffer(jimp.MIME_PNG, (err, buf) => {
                                                     if (err) return console.log(err);

                                                             let Avatar = Canvas.Image;
                                                             let ava = new Avatar;
                                                             ava.src = buf;
                                                             ctx.beginPath();
                                                           ctx.drawImage(ava, 335, 3, 160, 169);
                                                     ctx.font = '35px Arial Bold';
                                                     ctx.fontSize = '40px';
                                                     ctx.fillStyle = "#dadada";
                                                     ctx.textAlign = "center";


                                                     ctx.font = '30px Arial Bold';
                                                     ctx.fontSize = '30px';
                                                     ctx.fillStyle = "#ffffff";
                                                                             ctx.fillText(`${getvalueof.username}`,655, 170);


                                                          moment.locale('ar-ly');


                                                                    ctx.font = '30px Arial';
                                                     ctx.fontSize = '30px';
                                                     ctx.fillStyle = "#ffffff";
                                                                             ctx.fillText(`${moment(h.joinedAt).fromNow()}`,150, 305);


                                                                                                     ctx.font = '30px Arial';
                                                     ctx.fontSize = '30px';
                                                     ctx.fillStyle = "#ffffff";
                                                                 ctx.fillText(`${moment(heg.createdTimestamp).fromNow()}`,150, 170);

                                                       let status;
     if (getvalueof.presence.status === 'online') {
         status = 'اون لاين';
     } else if (getvalueof.presence.status === 'dnd') {
         status = 'مشغول';
     } else if (getvalueof.presence.status === 'idle') {
         status = 'خارج النطاق';
     } else if (getvalueof.presence.status === 'offline') {
         status = 'اوف لاين';
     }


                                          ctx.cont = '35px Arial';
                                          ctx.fontSize = '30px';
                                          ctx.filleStyle = '#ffffff'
                                          ctx.fillText(`${status}`,655,305)

                                                                   ctx.font = 'regular 30px Cairo';
                                                                   ctx.fontSize = '30px';
                                                                   ctx.fillStyle = '#ffffff'
                                                         ctx.fillText(`${h.presence.game === null ? "لا يلعب" : h.presence.game.name}`,390,390);

                               ctx.font = '35px Arial';
                                                                   ctx.fontSize = '30px';
                                                                   ctx.fillStyle = '#ffffff'
                                                                   ctx.fillText(`#${heg.discriminator}`,390,260)

                                 ctx.beginPath();
                                 ctx.stroke();
                               message.channel.sendFile(canvas.toBuffer());




                             })

                             })
 }
 });







client.on('ebnklb',function(ebnklb) {

    if(ebnklb.content.startsWith("<@438416315393245185>")) {
        ebnklb.channel.send('Hey Im **CS ❱❱ Bot!**')
        ebnklb.channel.send('CS ❱❱ Bot created By:`_THE_SUPER_PVP_`')
        ebnklb.channel.send('My Prefix `pro.`')

    }
});












client.on('message', message => {
  const port = '25565'
  if(message.content.startsWith(prefix + 'mcserver-stats')) {
 const args = message.content.split(" ").slice(1).join(" ")
    if (!args) return message.channel.send("** Type the server name **");
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(`https://api.minetools.eu/favicon/${args}/25565`)
        .addField(":scroll: Server Name",`${args}`,true)
        .addField(":globe_with_meridians: Server Port",`${port}`)
        .setImage(`http://status.mclive.eu/${args}/${args}/25565/banner.png`)
        .setFooter(`${bot.user.username}`)
                .setTimestamp()
    message.channel.send(embed)      
}})


















client.login(process.env.BOT_TOKEN);
