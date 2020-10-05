// Dependencies
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (bot, message) => {
	const res = await fetch('https://nekos.life/api/v2/img/meow').then(info => info.json()).catch(err => {
		// An error occured when looking for account
		bot.logger.error(`${err.message}`);
		message.channel.send({ embed:{ color:15158332, description:`${(message.channel.permissionsFor(bot.user).has('USE_EXTERNAL_EMOJIS')) ? bot.config.emojis.cross : ':negative_squared_cross_mark:'} An error occured when running this command, please try again or contact support.` } }).then(m => m.delete({ timeout: 10000 }));
		message.delete();
		return;
	});
	const embed = new Discord.MessageEmbed()
		.setImage(res.url);
	message.channel.send(embed);
};

module.exports.config = {
	command: 'cat',
	aliases: ['meow'],
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
};

module.exports.help = {
	name: 'Cat',
	category: 'image',
	description: 'Have a nice picture of a cat.',
	usage: '${PREFIX}cat',
};
