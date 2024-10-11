import { format } from 'util';

export default {
  name: 'eval',
  tags: 'owner',
  command: ['eval'],
  description: 'Eval',
  owner: true,
  run: async(m, { sock, text }) => {
    let evalCommand;

    try {
      evalCommand = await eval(` ( async() =>  { ${text} })() `);
    } catch (error) {
      evalCommand = error;
    } finally {
      await m.reply(format(evalCommand).trim());
    }
  } 
}