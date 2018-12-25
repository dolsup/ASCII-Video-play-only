#!/usr/bin/env node --harmony

/*=====================================================
                    IMPORTS / SETUP
======================================================*/
const yaml = require('js-yaml')
const program = require('commander')
const logUpdate = require('log-update')

const END_OF_FRAME_ID = '\nzzzzzzzzzzzzzzzzzzzzzzz'
/*=====================================================
                          MAIN
======================================================*/
program
  .version('0.1.2')
  .command('create')
  .description(
    'This is ASCII-Video-play-only. To create video, use ASCII-Video.'
  )
  .action(() => {
    console.error('This is ASCII-Video-play-only. To create sprite file from video, use ASCII-Video.')
  })

program
  .command('play <file>')
  .description('Plays back a generated sprite file')
  .option(
    '-f, --frame_rate <rate>',
    'A number which specifies the rate at which to iterate through the sprites'
  )
  .action((pathToFile, opts) => {
    console.log(pathToFile)
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(pathToFile),
    })

    let frame = ''
    const re = RegExp(END_OF_FRAME_ID, 'g')
    const frameRate = opts && opts.frame_rate ? opts.frame_rate : 155

    lineReader.on('line', async line => {
      lineReader.pause()
      const fragment = yaml.safeLoad(line)[0]
      frame += fragment

      if (re.test(frame)) {
        const frames = frame.split(END_OF_FRAME_ID)
        for (let frameItem of frames) {
          await delay(frameRate)
          if (frameItem.length) logUpdate(frameItem)
        }

        frame = ''
      }

      lineReader.resume()
    })
  })

program.parse(process.argv)
if (!program.args.length) program.help()

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}
