const Discord = require('discord.js');
const client = new Discord.Client();
const devs = ["460606140666085378"];
const adminprefix = ["-"];
var prefix = "!";  

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
client.user.setGame(` Rabbit Community.  `,"http://twitch.tv/S-F")
  console.log('')
  console.log('')
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log(`[Start] ${new Date()}`);
  console.log('╚[═════════════════════════════════════════════════════════════════]╝')
  console.log('')
  console.log('╔[════════════════════════════════════]╗');
  console.log(`Logged in as * [ " ${client.user.username} " ]`);
  console.log('')
  console.log('Informations :')
  console.log('')
  console.log(`servers! [ " ${client.guilds.size} " ]`);
  console.log(`Users! [ " ${client.users.size} " ]`);
  console.log(`channels! [ " ${client.channels.size} " ]`);
  console.log('╚[════════════════════════════════════]╝')
  console.log('')
  console.log('╔[════════════]╗')
  console.log(' Bot Is Online ')
  console.log('╚[════════════]╝')
  console.log('')
  console.log('')
});



client.on('guildMemberAdd', (member) => {
member.addRole(member.guild.roles.find('name', 'Member'));
});



client.on('message', message => {
    var prefix = "!";         //<=== هنا تقدر تغير البريفكس
   if(!message.channel.guild) return;
if(message.content.startsWith(prefix + 'clear')) {            //Codes Development .
if(!message.channel.guild) return message.channel.send('**This Command is Just For Servers**').then(m => m.delete(5000));         //Codes Development .
if(!message.member.hasPermission('MANAGE_MESSAGES')) return      message.channel.send('**You Do not have permission** `MANAGE_MESSAGES`' );
let args = message.content.split(" ").join(" ").slice(2 + prefix.length);      //Codes Development .
let request = `Requested By ${message.author.username}`;
message.channel.send(`**Are You sure you want to clear the chat?**`).then(msg => {
msg.react('✅')
.then(() => msg.react('❌'))
.then(() =>msg.react('✅'))   //Codes Development .

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
        footer: {          //Codes Development .

        }           //Codes Development .
      }}).then(msg => {msg.delete(3000)});

})     //Codes Development .
reaction2.on("collect", r => {   //Codes Development .
message.channel.send(`**Chat deletion cancelled**`).then(m => m.delete(5000));
msg.delete();
})
})
}
});   //Codes Development .


client.on('message', function(message) {
    if(message.content.startsWith (prefix  + 'server')) {
          let guild = message.guild;
  let icon = message.guild.iconURL;
  let createdAtRaw = guild.createdAt.toDateString();
  let createdAt = createdAtRaw.split(" ");
  let bots = message.guild.members.filter(m => m.user.bot).size;
  let humans = message.guild.members.filter(m => !m.user.bot).size;
  let channels = message.guild.channels.size;
  let textChannels = message.guild.channels.filter(m => m.type == "text").size;
  let voiceChannels = message.guild.channels.filter(i => i.type == "voice").size;
  let emojis = [];
  guild.emojis.forEach(emoji => {
  emojis.push(`\`${emoji}\``);
  });
  emojis.length === 0 ? emojis = "None" : emojis = emojis.join(", ");

  let roles = [];
  guild.roles.forEach(role => {
    roles.push(`\`${role.name}\``);
  });
  roles = roles.join(", ");

  let embed = new Discord.RichEmbed()
  .setTitle(`Server Stats`)
  .setThumbnail(icon)
  .addField('Guild Name', guild.name, true)
  .addField('Guild ID', guild.id, true)
  .addField('Guild Owner', `${guild.owner.user.tag}`, true)
  .addField('Created At', `${createdAt[0]} ${createdAt[2]} ${createdAt[1]} ${createdAt[3]}`, true)
  .addField('Region', guild.region.toUpperCase(), true)
  .addField('Total Members:', guild.memberCount, true)
  .addField('Bots:', bots, true)
  .addField('Users:', humans, true)
  .addField('Verification Level', guild.verificationLevel, true)
  .addField('Text Channels', textChannels, true)
  .addField('Voice Channels', voiceChannels, true)
  .addField(`Roles`, `${guild.roles.size}`, true)
  .addField(`Emojis`, `${guild.emojis.size}`, true)

      message.channel.send({embed:embed});
    }
  });



client.on('message', message => {
    if (message.content.startsWith("رابط")) {
 
  message.channel.createInvite({
        thing: true,
        maxUses: 100,
        maxAge: 86400
    }).then(invite =>
      message.author.sendMessage(invite.url)
    )
    const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setDescription("| :white_check_mark:   تم ارسال الرابط على الخاص  ")
      message.channel.sendEmbed(embed).then(message => {message.delete(10000)})
              const Embed11 = new Discord.RichEmbed()
        .setColor("RANDOM")
                .setAuthor(message.guild.name, message.guild.iconURL)
        .setDescription(`
**
---------------------
-[${message.guild.name}]  هذا هو رابط سيرفر
---------------------
-هذا الرابط صالح ل 100 مستخدم فقط
---------------------
-هذا الرابط صالح لمده 24 ساعه فقط
---------------------
**`)
      message.author.sendEmbed(Embed11)
    }
});


client.on('message', message => {
     if (message.content === "باي") {
message.channel.sendMessage("" + " :rose:باي");
    }
}); 


client.on('message', message => {
     if (message.content === "spam?") {
message.channel.sendMessage("يلا");
    }
}); 


client.on('message', message => {
     if (message.content === "برب") {
message.channel.sendMessage("" + " :rose:تيت");
    }
}); 


client.on('message', message => {
     if (message.content === "هاي") {
message.channel.sendMessage("" + "هايي");
    }
}); 

client.on('message', message => {
     if (message.content === "-help") {
message.channel.sendMessage("" + "1 - نظام الرد التلقائـي العربي :robot:                                                                                                                                                                       4 - **(-bc <message>)** BCخاصية الـ                                                                                                      ");
    }
});


client.on('message', message => {
     if (message.content === "هلوو") {
message.channel.sendEmbed("tt" + ":heart: هلوو");
    }
}); 


client.on('message', message => {
     if (message.content === "السلام " + "عليكم") {
message.channel.sendMessage("" + "وعليكم السلام");
    }
});     


client.on('message', message => {
	 if (message.content === "wping") {
	  const embed = new Discord.RichEmbed ()
  
  .setColor("#FF0000")
  .addField('``سرعة إتصال الـبوت`` ' , `${Date.now() - message.createdTimestamp}` + ' ms`')

  message.channel.sendEmbed(embed);
    }
});


client.on('message', message => {

              if(!message.channel.guild) return;

    var prefix = "!";

    if(message.content.startsWith('!bc')) {

    if(!message.channel.guild) return message.channel.send('**هذا الأمر فقط للسيرفرات**').then(m => m.delete(5000));

  if(!message.member.hasPermission('ADMINISTRATOR')) return      message.channel.send('**للأسف لا تمتلك صلاحية** `ADMINISTRATOR`' );

    let args = message.content.split(" ").join(" ").slice(2 + prefix.length);


    let request = `Requested By ${message.author.username}`;

    if (!args) return message.reply('**اكتب شي لي ارسال البرودكاست**');message.channel.send(`**هل أنت متأكد من إرسالك البرودكاست؟ \nمحتوى البرودكاست:** \` ${args}\``).then(msg => {

    msg.react('✅')

    .then(() => msg.react('❌'))

    .then(() =>msg.react('✅'))

    let reaction1Filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;

    let reaction2Filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

       let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 12000 });

    let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 12000 });

    reaction1.on("collect", r => {

    message.channel.send(`☑ | Done ... The Broadcast Message Has Been Sent For ${message.guild.members.size} Members`).then(m => m.delete(5000));

    message.guild.members.forEach(m => {

    var bc = new

       Discord.RichEmbed()

       .setColor('RANDOM')

         .setTitle('لي دخول السيرفر اضغط هنا')
       
       .setURL('رابط سيرفرك')

       .addField('Server', message.guild.name)

       .addField('Sender', message.author.username)

       .addField('Message', args)

    m.send({ embed: bc })

    msg.delete();

    })

    })

    reaction2.on("collect", r => {

    message.channel.send(`**Broadcast Canceled.**`).then(m => m.delete(5000));

    msg.delete();

    })

    })

    }

    });


client.on('message', message => {
      if(message.content.startsWith ("زواج")) {
      if(!message.channel.guild) return message.reply('** This command only for servers **')
      var proposed = message.mentions.members.first()
     
      if(!message.mentions.members.first()) return message.reply(' 😏 **لازم تطلب ايد وحدة**').catch(console.error);
      if(message.mentions.users.size > 1) return message.reply(' 😳 **ولد ما يصحلك الا حرمة وحدة كل مرة**').catch(console.error);
       if(proposed === message.author) return message.reply(`**خنثى ؟ **`);
        if(proposed === client.user) return message.reply(`** تبي تتزوجني؟ **`);
              message.channel.send(`**${proposed} 
 بدك تقبلي عرض الزواج من ${message.author} 
 العرض لمدة 15 ثانية  
 اكتبي موافقة او لا**`)

const filter = m => m.content.startsWith("موافقة");
message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
.then(collected =>{ 
    message.channel.send(` **${message.author} و ${proposed} الف الف مبروك الله , يرزقكم الذرية الصالحة** `);
})

   const filte = m => m.content.startsWith("لا");
message.channel.awaitMessages(filte, { max: 1, time: 15000, errors: ['time'] })
.then(collected =>{ 
   message.channel.send(`  **${message.author} تم رفض عرضك** `);
})
        
  }
});



client.login(process.env.BOT_TOKEN);
