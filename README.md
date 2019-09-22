# Overview
This is a minimalistic Node.js FTP Client.

It is a showcase of the Node.js library [ftp-sftp](https://www.npmjs.com/package/ftp-sftp) I created.

# Commands
- **ls** - lists the directory content of the current path
- **cd** - travels to the given path
- **setcd** - set the path directly
- **get** - gets a file from the remote server, downloads it to the local file system
- **put** - uploads a file from your local file system to the remote server
- **mkdir** - creates a directory on the remote server, relative to the current path
- **rmdir** - deletes a directory on the remote server, relative to the current path
- **del** - delets a file on the remote server, relative to the current path
- **mv** - renames/moves a file on the remote server

# Usage
1) npm start
2) Choose FTP or SFTP
3) Enter credentials
4) **Only** type the command name, hit enter
5) **Afterwards**, enter the requested parameters

## Correct Example
```
npm start
Which file system would you like to use? (ftp|sftp) > ftp
Host? > 127.0.0.1
Port? > 21
User? > root
Password? (Warning, visible in console) > password

Path: /
Action? (ls|cd|setcd|get|put|mkdir|rmdir|del|mv) > 
mkdir
Directory name? > /wow
Recursively? (enter nothing for no) >
Directory created.
```
