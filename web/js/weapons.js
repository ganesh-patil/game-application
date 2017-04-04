Crafty.c("Bullet",{
    dmg:0,
    firerate:0,
    bulletScore:1,
    pause:false,
    init:function(){
        this.addComponent("2D","Canvas","Collision")
        .onHit("Bullet",function(ent){
            this.destroy();
            ent[0].obj.destroy();
            this.updateStats(this.bulletScore);
        })
        .bind("PauseReset", function(){
            if(this.pause) {
               this.pause = false;
            }
            else {
                this.pause = true;
            }
        });
    },
    updateStats:function(score){
      Crafty.trigger("UpdateStats", score);
    }
});

Crafty.c("Weapon1",{
    init:function(){
        this
        .addComponent("Bullet","laser1")
        .origin("center")
        .bind("EnterFrame", function() {
            if(!this.pause) {
                this.x += this.xspeed;
                this.y -= this.yspeed; 
            }
        })
        .attr({
            dmg:1
        });
    } 
});
Crafty.c("BulletBot",{
    init:function(){
        this
        .addComponent("Bullet","laser1")
        .origin("center")
        .bind("EnterFrame", function() {
            if(!this.pause) {
                this.x -= this.xspeed;
                this.y += this.yspeed;  
            }
        }).attr({
            dmg:2
        });
    } 
});
