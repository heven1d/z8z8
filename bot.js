const Discord = require('discord.js');
const client = new Discord.Client();
const devs = ["460606140666085378" , "284005623895425024"];
const adminprefix = ["-"];
var prefix = "^";  

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
client.user.setGame(`^help | Netflix Customer`) //    ,"http://twitch.tv/S-F"
client.channels.get("539927972270833695").join(); 
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


client.on('message', message => {//for dev
  var argresult = message.content.split(` `).slice(1).join(' ');
    if (!devs.includes(message.author.id)) return;

if (message.content.startsWith(adminprefix + 'setgame')) {
  client.user.setGame(argresult);
    message.channel.sendMessage(`**${argresult} تم تغيير بلاينق البوت إلى **`)
} else
  if (message.content.startsWith(adminprefix + 'setname')) {
client.user.setUsername(argresult).then
    message.channel.sendMessage(`**${argresult}** : تم تغيير أسم البوت إلى`)
return message.reply("**من فضلك يجب عليك الانتظآر لمدة ساعتين ومن ثم قم بتغيير الأسم..!**");
} else
  if (message.content.startsWith(adminprefix + 'setavatar')) {
client.user.setAvatar(argresult);
  message.channel.sendMessage(`**${argresult}** : تم تغير صورة البوت`);
      } else
if (message.content.startsWith(adminprefix + 'setT')) {
  client.user.setGame(argresult, "https://www.twitch.tv/faresgameryt");
    message.channel.sendMessage(`**تم تغيير تويتش البوت إلى  ${argresult}**`)
}


    });





client.on("message", message => {
     if (message.content === "^help") {
         message.react('👌')
         if(!message.channel.guild) return message.reply('** This command only for servers **');
        message.reply("** تم الإرسال في الخاص :heavy_check_mark: **")
     }
});

client.on("message", message => {
 if (message.content === "^help") {
  const embed = new Discord.RichEmbed()
      .setColor("#ff0000")
      .setThumbnail(message.author.avatarURL)
      .setDescription(`
 **
ــــــــــــــــــــــــــــــــــــــــــــــــــ
                  Prefix = ' ^ '
ــــــــــــــــــــــــــــــــــــــــــــــــــ


                ❖ اوامر عامة ❖  

❖ ^notes ➾ مـلاحظات يجب قرائتـها
❖ ^bc ➾ إرسال رسالة للجميع
❖ ^members ➾ معلومات الاعضاء
❖ ^avatar ➾ شعار حسابك
❖ ^bot ➾ معلومات البوت
❖ ^clear ➾ مسـح الشـات
❖ ^ping ➾ معـرفة سرعـة البـوت
❖ ^server ➾ معلومات السيرفر
❖ ^new (Subject) ➾ لفتح تـذكـرة
❖ ^close ➾ لإغـلاق تـذكـرة
❖ ^roles ➾ لإظهار رتب سيرفرك
❖ ^role ➾ لإعطاء احد رتبة 


**
`)


message.author.sendEmbed(embed)

}
});





client.on("message", message => {
 if (message.content === "^notes") {
  const embed = new Discord.RichEmbed()
      .setColor("#ff0000")
      .setThumbnail(message.author.avatarURL)
      .setDescription(`
 **
             مـلاحــظــة


أمر التذكره لها قوانين يرجى كتابة       ^ticket


    اذا اردت ان يعطى لأي شخص رتبة عندما يدخل الى السيرفر يجب ان يكون اسم الرتبة Members


     Welcome اذا اردت البوت بأن يقوم بالترحيب اصنع روم بأسم

**
`)


message.author.sendEmbed(embed)

}
});




client.on('message', message => { 
    var prefix = "^";
    if (message.author.boss) return;
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length);
    if (command == "role") {
    if (!message.channel.guild) return;
    if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return message.reply("**:no_entry_sign:انت لا تملك صلاحيات **").then(msg => msg.delete(5000));;
    if(!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.reply("البوت لايملك صلاحيات ").then(msg => msg.delete(5000));;
    let user = message.mentions.users.first();
    if (message.mentions.users.size < 1) return message.reply('**ضع منشن الشخص!!**').then(msg => {msg.delete(5000)});
    let MRole = message.content.split(" ").slice(2).join(" ");
    if(!MRole)return message.reply("يجب عليك وضع اسم الرتبة").then(msg => {msg.delete(5000)});
    message.guild.member(user).addRole(message.guild.roles.find("name", MRole));
    message.reply('*** Done :white_check_mark:  ***').then(msg => {msg.delete(10000)});
    }
    });








// guilds.get('539870654816583680').




client.on('message', message => {
  const port = '25565'
  if(message.content.startsWith('^mcstats')) {
 const args = message.content.split(" ").slice(1).join(" ")
    if (!args) return message.channel.send("** Write Server IP . **");
        let embed = new Discord.RichEmbed()
        .setColor('#ff0000')
        .setThumbnail(`https://api.minetools.eu/favicon/${args}/25565`)
        .addField("📜 Server NIP",`${args}`,true)
        .addField("🌐 Server Port",`${port}`)
        .setImage(`http://status.mclive.eu/${args}/${args}/25565/banner.png`)
        .setFooter(`McStats`)
                .setTimestamp()
    message.channel.send(embed)      
}})




client.on('message', message => {
    if (message.content === '^roles') {
        var roles = message.guild.roles.map(roles => `${roles.name}, `).join(' ')
        const embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .addField('Roles:',`**[${roles}]**`)
        message.channel.sendEmbed(embed);
    }
});





client.on("message", message => {
 if (message.content === "^invite") {
  const embed = new Discord.RichEmbed()
      .setColor("#ff0000")
      .setThumbnail(message.author.avatarURL)
      .setDescription(`
 **
https://discordapp.com/api/oauth2/authorize?client_id=539862959870967808&permissions=0&scope=bot
**
`)


message.author.sendEmbed(embed)

}
});





//client.on("ready", () => { // كود رينبو
  //function lol() {
    //client.guilds.get('539870654816583680').roles.find("name", "*").setColor("RANDOM");
  //};
  //setInterval(lol, 350);
//});





client.on('message', message => {
   if(!message.channel.guild) return;
if(message.content.startsWith('^bc')) {
if(!message.channel.guild) return message.channel.send('**هذا الأمر فقط للسيرفرات**').then(m => m.delete(5000));
if(!message.member.hasPermission('ADMINISTRATOR')) return      message.channel.send(':no_entry: | You dont have **ADMINISTRATOR** Permission!' );
let args = message.content.split(" ").join(" ").slice(2 + prefix.length);
let BcList = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setAuthor(`محتوى الرساله ${args}`)
.setDescription(`برودكاست بـ امبد :pencil:\nبرودكاست بدون امبد:pencil2: \nلديك دقيقه للأختيار قبل الغاء البرودكاست`)
if (!args) return message.reply('**يجب عليك كتابة كلمة او جملة لإرسال البرودكاست**');message.channel.send(BcList).then(msg => {
msg.react('📝')
.then(() => msg.react('✏'))
.then(() =>msg.react('📝'))
 
let EmbedBcFilter = (reaction, user) => reaction.emoji.name === '📝' && user.id === message.author.id;
let NormalBcFilter = (reaction, user) => reaction.emoji.name === '✏' && user.id === message.author.id;
 
let EmbedBc = msg.createReactionCollector(EmbedBcFilter, { time: 60000 });
let NormalBc = msg.createReactionCollector(NormalBcFilter, { time: 60000 });
 
EmbedBc.on("collect", r => {
message.channel.send(`:ballot_box_with_check: تم ارسال الرساله بنجاح`).then(m => m.delete(5000));
message.guild.members.forEach(m => {
var bc = new
Discord.RichEmbed()
.setColor('#FF0000')
  .setTitle('`-Broadcast-`')
.setAuthor(`Server : ${message.guild.name}`)
.setFooter(`Sender : ${message.author.username}`)
.setDescription(`Message : ${args}`)
.setThumbnail(message.author.avatarURL)
m.send({ embed: bc })
msg.delete();
})
})
NormalBc.on("collect", r => {
  message.channel.send(`:ballot_box_with_check: تم ارسال الرساله بنجاح`).then(m => m.delete(5000));
message.guild.members.forEach(m => {
m.send(args);
msg.delete();
})
})
})
}
});





client.on('message' , message => {
  if(message.content.startsWith('12backup-voice')){
         if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
        message.guild.createChannel('Voice Area', 'category').then(cg => {
        message.guild.createChannel('Relax', 'voice').then(cha => {
        message.guild.createChannel('Coffe', 'voice').then(a7aa => {
        message.guild.createChannel('Cronner', 'voice').then(a7aaa=> {
        message.guild.createChannel('Music', 'voice').then(a7aaaa => {
            cha.setParent(cg)
            a7aa.setParent(cg)
            a7aaa.setParent(cg)
            a7aaaa.setParent(cg)

                           message.reply('**I Make Voice Rooms **')
        });})
           })
})
})

}
          });



client.on('message' , message => {
  if(message.content.startsWith('12backup-chat-info')){
         if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
        message.guild.createChannel('INFO Area', 'category').then(cg => {
        message.guild.createChannel('news', 'chat').then(cha => {
        message.guild.createChannel('bot-updates', 'chat').then(a7aa => {
        message.guild.createChannel('giveaways', 'chat').then(a7aaa=> {
        message.guild.createChannel('premium-prices', 'chat').then(a7aaaa => {

            cha.setParent(cg)
            a7aa.setParent(cg)
            a7aaa.setParent(cg)
            a7aaaa.setParent(cg)

                           message.reply('**I Make Text Rooms **')
        });})
           })
})
})

}
          });



client.on('message' , message => {
  if(message.content.startsWith('12backup-chat')){
         if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
        message.guild.createChannel('Text Area', 'category').then(cg => {
        message.guild.createChannel('chat', 'chat').then(cha => {
        message.guild.createChannel('commands', 'chat').then(a7aa => {
        message.guild.createChannel('photos', 'chat').then(a7aaa=> {
        message.guild.createChannel('cut-tweet', 'chat').then(a7aaaa => {

            cha.setParent(cg)
            a7aa.setParent(cg)
            a7aaa.setParent(cg)
            a7aaaa.setParent(cg)

                           message.reply('**I Make Text Rooms **')
        });})
           })
})
})

}
          });




client.on('message', message => {
    if (message.content == '^server') {
        var servername = message.guild.name
        var اونر = message.guild.owner
        var اعضاء = message.guild.memberCount
        var ايدي = message.guild.id
        var بلدالسيرفر = message.guild.region
        var الرومات = message.guild.channels.size
        var الرتب = message.guild.roles
        var عمل = message.guild.createdAt
        var الروم = message.guild.defaultChannel
        var server = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setThumbnail(message.guild.iconURL)
            .addField('اسم السيرفر', servername)
            .addField('اي دي السيرفر ', [ايدي])
            .addField('أعضاء السيرفر', اعضاء)
            .addField('رومات السيرفر', الرومات)
            .addField('روم الشات الأساسي', الروم)
            .addField('صاحب السيرفر', اونر)
            .addField('بلد السيرفر', بلدالسيرفر)
            .addField('تاريخ افتتاح السيرفر', عمل)
            .setColor('RANDOM')

        message.channel.sendEmbed(server)
    }

});





client.on('message', async message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content === '/join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});





client.on('guildMemberAdd', (member) => {
member.addRole(member.guild.roles.find('name', 'Members'));
});



const bannedwords = [
    "كل زق",
    "كسمك",
    "كس امك",
    "قحبة",
    "قحبه",
    "شرموطه",
  ];

client.on('message',  message => {
  if(bannedwords.some(word => message.content.includes(word))) {
    message.delete()
    message.reply(" احترم نفسك , يمنع الشتم  او سوف تتعرض الي  ميوت ").then(msg => {msg.delete(5000)});;
  };
});




client.on('guildMemberAdd', member => {
    let channel = member.guild.channels.find('name', 'welcome');
    let memberavatar = member.user.avatarURL
      if (!channel) return;
    let embed = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setThumbnail(memberavatar)
        .addField(':running_shirt_with_sash: | name :  ',`${member}`)
        .addField(':loudspeaker: | اطلق من دخل' , `Welcome to the server, ${member}`)
        .addField(':id: | user :', "**[" + `${member.id}` + "]**" )
                .addField('➡| انت العضو رقم',`${member.guild.memberCount}`)

                  .addField("Name:",`<@` + `${member.id}` + `>`, true)

                                     .addField(' الـسيرفر', `${member.guild.name}`,true)

     .setFooter(`${member.guild.name}`)
        .setTimestamp()

      channel.sendEmbed(embed);
    });





client.on('message', message => {
    var prefix = "^";         //<=== هنا تقدر تغير البريفكس
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




client.on('message', message => {
    if (message.content.startsWith("^avatar")) {
        var mentionned = message.mentions.users.first();
    var x5bzm;
      if(mentionned){
          var x5bzm = mentionned;
      } else {
          var x5bzm = message.author;

      }
        const embed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setImage(`${x5bzm.avatarURL}`)
      message.channel.sendEmbed(embed);
    }
});


client.on('message', message => {
     if (message.content === "^bot") {
            if(!message.channel.guild) return message.reply('** This command only for servers **');
     let embed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .addField("**عدد السيرفرات الي فيها البوت:**" , client.guilds.size)
  .addField("**المستخدمين:**", client.users.size)
  .addField("**قنوات:**", client.channels.size)
  .addField("**")
  .setTimestamp()
message.channel.sendEmbed(embed);
    }
});




client.on('message', message => {
    if(message.content == '^members') {
       message.react(":white_check_mark:")
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



client.on('message', message => {
    if(message.content.startsWith(prefix + 'new')) {
        let args = message.content.split(' ').slice(1).join(' ');
        let support = message.guild.roles.find("name","Support");
        let ticketsStation = message.guild.channels.find("name", "TICKETS");
        if(!args) {
            return message.channel.send('Please type a subject for the ticket.');
        };
                if(!support) {
                    return message.channel.send('**Please make sure that `Support` role exists and it\'s not duplicated.**');
                };
            if(!ticketsStation) {
                message.guild.createChannel("TICKETS", "category");
            };
                message.guild.createChannel(`ticket-${message.author.username}`, "text").then(ticket => {
                    message.delete()
                        message.channel.send(`Your ticket has been created. [ ${ticket} ]`);
                    ticket.setParent(ticketsStation);
                    ticketsStation.setPosition(1);
                        ticket.overwritePermissions(message.guild.id, {
                            SEND_MESSAGES: false,
                            READ_MESSAGES: false
                        });
                            ticket.overwritePermissions(support.id, {
                                SEND_MESSAGES: true,
                                READ_MESSAGES: true
                            });
                                ticket.overwritePermissions(message.author.id, {
                                    SEND_MESSAGES: true,
                                    READ_MESSAGES: true
                                });
                    let embed = new Discord.RichEmbed()
                                .setTitle('**New Ticket.**')
                                .setColor("#FF0000")
                                .setThumbnail(`${message.author.avatarURL}`)
                                .addField('Subject', args)
                                .addField('Author', message.author)
                                .addField('Channel', `<#${message.channel.id}>`);

                                ticket.sendEmbed(embed);
                }) .catch();
    }
    if(message.content.startsWith(prefix + 'close')) {
            if(!message.member.hasPermission("ADMINISTRATOR")) return;
        if(!message.channel.name.startsWith("ticket")) {
            return;
        };  
                let embed = new Discord.RichEmbed()
                    .setAuthor("Do you really want to close this ticket? Repeat the command to make sure. You have 20 seconds.")
                    .setColor("#FF0000");
                    message.channel.sendEmbed(embed) .then(codes => {

                    
                        const filter = msg => msg.content.startsWith(prefix + 'close');
                        message.channel.awaitMessages(response => response.content === prefix + 'close', {
                            max: 1,
                            time: 20000,
                            errors: ['time']
                        })
                        .then((collect) => {
                            message.channel.delete();
                        }) .catch(() => {
                            codes.delete()
                                .then(message.channel.send('**Operation has been cancelled.**')) .then((c) => {
                                    c.delete(4000);
                                })
                                    
                            
                        })


                    })


            
    }
});


client.on('message', message => {
    if (message.content.startsWith("رابط")) {
        message.channel.createInvite({
        thing: true,
        maxUses: 20,
        maxAge: 86400,
    }).then(invite =>
      message.author.sendMessage(invite.url)
    )
    const embed = new Discord.RichEmbed()
        .setColor("#FF0000")
          .setDescription(" تم أرسال الرابط برسالة خاصة ")
           .setAuthor(client.user.username, client.user.avatarURL)
                 .setAuthor(client.user.username, client.user.avatarURL)
                .setFooter('طلب بواسطة: ' + message.author.tag)

      message.channel.sendEmbed(embed).then(message => {message.delete(10000)})
              const Embed11 = new Discord.RichEmbed()
        .setColor("#FF0000")

    .setDescription(" مدة الرابط : يوم | عدد استخدامات الرابط : 20 ")
      message.author.sendEmbed(Embed11)
    }
});


client.on('message', message => {
     if (message.content === "باي") {
message.channel.sendMessage("" + " :rose:باي");
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
     if (message.content === "^invite") {
message.channel.sendMessage(":heart_exclamation:  تم الإرسال فـ الخاًص");
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
	 if (message.content === "^ping") {
	  const embed = new Discord.RichEmbed ()
  
  .setColor("#FF0000")
  .addField('``سرعة إتصال الـبوت`` ' , `${Date.now() - message.createdTimestamp}` + ' ms`')

  message.channel.sendEmbed(embed);
    }
});




client.on('message', message => {
	 if (message.content === "^ticket") {
	  const embed = new Discord.RichEmbed ()
  
  .setColor("#FF0000")
  .setDescription(`
 **
                          (1)
	      يجب عليك صناعة رتبة بأسم 	
                        Support  
ـــــــــ

                                              (2)
                هده الخطوه يقوم بها مالك السيرفر مرة واحده فقط عند دخول البوت 
      Tickets تكون بأسم  Categoryوهي أن ينشىء تذكره سيظهر روم مفتوح قم بمسحه و أرفع الـ
            الآخرى بعدها قم بصناعة تذكره جديده للتأكذ من صحتها Categoryوضعها بين الـ
ـــــــــ                  
 
                                            (3)
                               هذا الشيىء مؤقت و سيتم إصلاحه
**
`)

  message.channel.sendEmbed(embed);
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
