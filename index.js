const {LocalFileSystem, FtpFileSystem, SftpFileSystem} = require('ftp-sftp')


async function start() {
  const local = new LocalFileSystem()
  var ftp = null

  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  function askFtpOrSftp() {
    rl.question('Which file system would you like to use? (ftp|sftp) > ', res => {
      if (res == 'ftp' || res == 'sftp') {
        askLoginData(res)
      } else {
        console.log("Invalid remote system.")
        askFtpOrSftp()
      }
    })
  }

  function askLoginData(remoteSystem) {
    const FileSystemClass = remoteSystem === 'ftp' ? FtpFileSystem : SftpFileSystem

    rl.question('Host? > ', host => {
      rl.question('Port? > ', port => {
        rl.question('User? > ', user => {
          rl.question('Password? (Warning, visible in console) > ', password => {
            FileSystemClass.create(host, port, user, password)
              .then(fileSystem => {
                // refers to the ftp from line 6
                ftp = fileSystem
                askAction()
              }).catch(err => {
                console.log("Error while connecting to the " + remoteSystem + " server:", err)
                console.log("Please choose another remote system or other credentials.")
                console.log(" ")
                askFtpOrSftp()
              })

          })
        })
      })
    })
  }
  
  var path = '/'
  function askAction() {
    console.log("Path:", path)
    rl.question('Action? (ls|cd|setcd|get|put|mkdir|rmdir|del|mv) > ', (res) => {
      if (res == 'ls') {
        ls()
      } else if (res == 'cd') {
        cd()
      } else if (res == 'setcd') {
        setcd()
      } else if (res == 'get') {
        get()
      } else if (res == 'put') {
        put()
      } else if (res == 'mkdir') {
        mkdir()
      } else if (res == 'rmdir') {
        rmdir()
      } else if (res == 'del') {
        del()
      } else if (res == 'mv') {
        mv()
      } else {
        console.log("UNKNOWN ACTION!")
        askAction()
      }
    })
  }
  function cd() {
    rl.question('Path? > ' + path, res => {
      if (res[res.length - 1] != '/') { res += '/' }
      path += res
      askAction()
    })
  }
  function ls() {
    ftp.list(path)
    .then(list => {
      console.log(path, list.map(file => ({name: file.getName(), size: file.getSize(), isDirectory: file.isDirectory()})))
    })
    .catch(err => {
      console.log("ERROR:", err)
    })
    .finally(askAction)
  }
  function setcd() {
    rl.question('New Path? > ', (res) => {
      path = res
      askAction()
    })
  }
  function get() {
    rl.question('File name for current Path (remote/FTP)? > ' + path, res => {
      const absoluteRemotePath = path + res
      rl.question('Destination path (local)? >', res => {
        const absoluteLocalPath = res
        
        ftp.get(absoluteRemotePath)
          .then(read => {
            return local.put(read, absoluteLocalPath)
          }).catch(err => {
            console.log("ERROR:", err)
          }).finally(askAction)
      })
    })
  }
  function put() {
    rl.question('Source path (local)? > ', res => {
      const absoluteLocalPath = res
      rl.question('RELATIVE (!!) Destination path (FTP/remote)? ' + path, res => {
        const absoluteRemotePath = path + res
        local.get(absoluteLocalPath)
          .then(read => {
            return ftp.put(read, absoluteRemotePath)
          }).catch(err => {
            console.log("ERROR:", err)
          }).finally(askAction)
      })
      //
    })
  }
  function mkdir() {
    rl.question('Directory name? > ' + path, res => {
      rl.question('Recursively? (enter nothing for no) >', rec => {
        const absolutePath = path + res
        ftp.mkdir(absolutePath, rec).then(() => {
          console.log("Directory created.")
        }).catch(err => {
          console.log("ERROR:", err)
        }).finally(askAction)
      })
    })
  }
  function rmdir() {
    rl.question('Directory name? > ' + path, res => {
      rl.question('Recursively? (enter nothing for no) >', rec => {
        const absolutePath = path + res
        ftp.rmdir(absolutePath, rec).then(() => {
          console.log("Directory deleted.")
        }).catch(err => {
          console.log("ERROR:", err)
        }).finally(askAction)
      })
    })
  }
  function del() {
    rl.question('File name? > ' + path, res => {
      const absolutePath = path + res
      ftp.delete(absolutePath).then(() => {
        console.log("Success")
      }).catch(err => {
        console.log("ERROR:", err)
      }).finally(askAction)
    })
  }
  function mv() {
    rl.question('Full/Absolute path from? > ', res => {
      const absolutePathFrom = res
      rl.question('Full/Absolute path to? > ', res2 => {
        const absolutePathTo = res2
        ftp.rename(absolutePathFrom, absolutePathTo)
          .then(() => {
            console.log("File moved.")
          }).catch(err => {
            console.log("ERROR:", err)
          }).finally(askAction)
      })
    })
  }
  askFtpOrSftp()
}

start()