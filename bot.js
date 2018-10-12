const Discord = require('discord.js');
const client = new Discord.Client();

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



client.on('message' , message => {
  if(message.content.startsWith('-Voice')){
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
    if (message.content.split(' ')[0] == '!bc')
       message.guild.members.forEach( member => {
         if (!message.member.hasPermission("ADMINISTRATOR"))  return;


           member.send( ` ${member} ` + "**" + "  ** " + message.content.substr(3));
                                                      message.delete();
            
                                                    });
            
                                                  });
   client.on("message", message => {
       var prefix = "!";
 
             var args = message.content.substring(prefix.length).split(" ");
                if (message.content.startsWith(prefix + "b")) {
                          if (!message.member.hasPermission("ADMINISTRATOR"))  return;

                          if (!args[1]) {
                            
                                 let embed3 = new Discord.RichEmbed()
                                     .setDescription(":white_check_mark: | تم ارسال رسالة لا يوجد فيها شيء")
                                       .setColor("#FF00FF")
                                          message.channel.sendEmbed(embed3);
                            
                                        } else {

                            
                                           let embed4 = new Discord.RichEmbed()
                                                            .setDescription(':white_check_mark: | تم ارسال الرساله للجميع ..')
                                                                .setColor("#99999")
                               
                                                                message.channel.sendEmbed(embed4);
                                                      message.delete();
                            }
                          }
});

client.login(process.env.BOT_TOKEN);
