import chalk from 'chalk'

export const chalkLogger = {
  info: (message: string) => {
    console.log(chalk.blue('[INFO]'), message)
  },

  success: (message: string) => {
    console.log(chalk.green('[SUCCESS]'), message)
  },

  error: (message: string) => {
    console.log(chalk.red('[ERROR]'), message)
  },
}
