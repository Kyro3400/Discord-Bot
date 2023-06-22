// Dependencies
const	{ AttachmentBuilder, ApplicationCommandOptionType } = require('discord.js'),
	{ Embed } = require('../../utils'),
	Command = require('../../structures/Command.js');

/**
 * QRCode command
 * @extends {Command}
*/
class QRcode extends Command {
	/**
 	 * @param {Client} client The instantiating client
 	 * @param {CommandData} data The data for the command
	*/
	constructor(bot) {
		super(bot, {
			name: 'qrcode',
			dirname: __dirname,
			aliases: ['qr-code'],
			description: 'Create a QR code.',
			usage: 'qrcode <text / file>',
			cooldown: 5000,
			examples: ['qrcode https://www.google.com/', 'qrcode <attachment>'],
			slash: true,
			options: [{
				name: 'text',
				description: 'URL',
				type: ApplicationCommandOptionType.String,
				required: true,
			}],
		});
	}

	/**
	 * Function for receiving message.
	 * @param {bot} bot The instantiating client
 	 * @param {message} message The message that ran the command
 	 * @readonly
	*/
	async run(bot, message) {
		// Get text for QR encoding (including file URl)
		const text = (!message.args[0]) ? await message.getImage().then(r => r[0]) : message.args.join(' ');

		// send 'waiting' message to show bot has recieved message
		const msg = await message.channel.send(message.translate('misc:GENERATING_IMAGE', {
			EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '' }));

		// Try and convert image
		try {
			const resp = await bot.fetch('misc/qrcode', { url: text });

			const attachment = new AttachmentBuilder(Buffer.from(resp, 'base64'), { name: 'QRCODE.png' });
			const embed = new Embed(bot, message.guild)
				.setImage('attachment://QRCODE.png');
			message.channel.send({ embeds: [embed], files: [attachment] });
		} catch(err) {
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
		}
		msg.delete();
	}

	/**
 	 * Function for receiving interaction.
 	 * @param {bot} bot The instantiating client
 	 * @param {interaction} interaction The interaction that ran the command
 	 * @param {guild} guild The guild the interaction ran in
	 * @param {args} args The options provided in the command, if any
 	 * @readonly
	*/
	async callback(bot, interaction, guild, args) {
		const text = args.get('text').value,
			channel = guild.channels.cache.get(interaction.channelId);

		await interaction.reply({ content: guild.translate('misc:GENERATING_IMAGE', { EMOJI: bot.customEmojis['loading'] }) });

		try {
			const resp = await bot.fetch('misc/qrcode', { url: text });

			// Check if an object was sent instead (probs an error)
			const isObject = typeof resp.toString() == 'object';
			if (isObject) {
				const possibleError = JSON.parse(resp.toString())?.error;
				if (possibleError) throw new Error(possibleError);
			}

			const attachment = new AttachmentBuilder(Buffer.from(resp, 'base64'), { name: 'QRCODE.png' });
			const embed = new Embed(bot, guild)
				.setImage('attachment://QRCODE.png');
			interaction.editReply({ content: ' ', embeds: [embed], files: [attachment] });
		} catch(err) {
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return interaction.editReply({ content: ' ', embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
		}
	}
}

module.exports = QRcode;
