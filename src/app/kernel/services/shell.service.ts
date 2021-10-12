import { Injectable } from '@angular/core';
import { LexedCommand } from '../interface/lexed-command';
import { Param } from '../interface/Param';
import { ExecutablesService } from './executables.service';

@Injectable()
export class ShellService {
  constructor(private readonly executables: ExecutablesService) {}

  public async run(commands: string[]): Promise<string> {
    try {
      if (!(commands instanceof Array)) {
        throw new Error('Command must be a array');
      }

      const lexedCommands: LexedCommand[] = [];

      for (const command of commands) {
        lexedCommands.push(this.lexer(command));
      }

      for (const lexedCommand of lexedCommands) {
        await this.execute(lexedCommand);
      }

      return 'Command Executed Successfully';
    } catch (error) {
      return error + ' ';
    }
  }

  private lexer(command: string): LexedCommand {
    let commandFunction = '';
    const commandParams: Param = {};

    // Get the function from the command
    commandFunction = command.split(' ')[0];

    // Split the command by and whitespace that has a -- after it
    for (const param of command.split(' --')) {
      if (!param.includes('=')) {
        continue;
      }

      let key = param.split('=')[0];
      key = key.replace('--', '');

      commandParams[key] = param.split('=')[1];
    }

    return {
      func: commandFunction,
      params: commandParams,
    };
  }

  private async execute(command: LexedCommand): Promise<void> {
    await this.executables.launch(command.func, command.params);
  }
}
