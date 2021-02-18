# task-board

## Locally

### Setup

  * `git clone git@github.com:chrispalmeri/task-board.git`
  * Create `.env` file with `NOAA_GRID`, `NOAA_STATION`, `NOAA_AGENT`
  * `vagrant up`
  * View it at http://localhost:8080/
  * Visit `/db/install.php` for fresh database, or drop you `database.db` into `www/db/`
  * Make code changes

### Testing

  * You can test the `/api/update`, it should work but will not change web root so you won't see any changes
  * You could `vagrant ssh`, `cd /vagrant`, `sudo ./install.sh` to serve that instead of local copy, you would have to `vagrant provision` to revert
  * also to add db to that environment within vagrant `sudo cp /vagrant/www/db/database.db /srv/task-board/www/db/database.db`

## Production

### NanoPi setup

  * ssh in as `root` using `1234`
  * enter new password twice
  * select locale
  * new user wizard
    * username
    * password
    * real name can be blank
  * `apt update`
  * `DEBIAN_FRONTEND=noninteractive apt upgrade -y`
  * `armbian-config`
      * System > Install > Install/Update the bootloader on SD/eMMC > Yes
      * Ok > Back
      * Personal > Hostname > type a new hostname
      * Ok > Ok > Back > Exit
  * `shutdown -r now` to reboot
  * ssh again with your new user and `sudo armbian-config`
  * Network > IP > Static > Enter the ip
  * Ok - it will freeze, you can disconnect

### App install

  * On Armbian box
  * In home dir `curl -O https://raw.githubusercontent.com/chrispalmeri/task-board/master/install.sh`
  * `chmod +x install.sh`
  * `sudo ./install.sh`
  * update apache env's `sudo nano /etc/apache2/conf-available/env.conf`, then `sudo systemctl restart apache2`
  * From local machine `scp www/db/database.db <uname>@<server>:/srv/task-board/www/db/database.db`
  * View it at your server's address
  * Update app from `/api/update`
