// Dependencies
const Discord = require('discord.js');

module.exports.run = async (bot, message, args, settings) => {
	// Make sure a choice was made
	if (!args[0]) {
		if (message.deletable) message.delete();
		message.channel.send({ embed:{ color:15158332, description:`${(message.channel.permissionsFor(bot.user).has('USE_EXTERNAL_EMOJIS')) ? bot.config.emojis.cross : ':negative_squared_cross_mark:'} Please use the format \`${bot.commands.get('rps').help.usage.replace('${prefix}', settings.prefix)}\`.` } }).then(m => m.delete({ timeout: 3000 }));
		return;
	}
	// Make sure rock, paper or scissors was their choice
	if (args[0].includes('paper') || args[0].includes('rock') || args[0].includes('scissors')) {
		// Bot decision time
		const choices = ['rock', 'paper', 'scissors'];
		const choice = choices[Math.floor(Math.random() * choices.length)];
		let winner;
		if (choice == args[0]) {
			winner = 'no one';
		} else if ((choice == 'rock' && args[0] == 'scissors') || (choice == 'paper' && args[0] == 'rock') || (choice == 'scissors' && args[0] == 'paper')) {
			winner = 'bot';
		} else {
			winner = 'user';
		}
		const embed = new Discord.MessageEmbed()
			.setTitle('Rock Paper Scissors')
			.setDescription(`**You choose:** ${args[0]}
      **I choose:** ${choice}\n
      Result: ${winner} has win`);
		message.channel.send(embed);
	}
};

module.exports.config = {
	command: 'rps',
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
};

module.exports.help = {
	name: 'Rock, Paper, Scissors',
	category: 'Fun',
	description: 'Play rock, paper, scissors with me.',
	usage: '${prefix}rps <rock | paper | scissors>',
	example: '${prefix}rps rock',
};
