  
jQuery(document).ready(function(){
    //Init Crafty
    Crafty.init(600,400, document.getElementById('cr-stage'));
   
   // set background url
    // Crafty.background("url(" + game_path + "img/bg.png)");

     //Bind UpdateStats Event
    Crafty.bind("UpdateStats",function(score){
       currentScore = parseInt(jQuery("#scoreTxt").text());
       jQuery("#scoreTxt").text(currentScore+score);

    });

    //Bind UpdateStats Event
    Crafty.bind("ReduceScore",function(score){
       currentScore = parseInt(jQuery("#scoreTxt").text());
       jQuery("#scoreTxt").text(currentScore-score);

    });

    //Bind UpdateScore Event to update user score
     Crafty.bind("UpdateScore",function(){
       currentScore = parseInt(jQuery("#scoreTxt").text());
       params = { score:currentScore };
       updateData(params);
       scrollLock = false;

    });

   //Bind UpdateLevel Event to update users level
     Crafty.bind("UpdateLevel",function(){
       currentLevel = parseInt(jQuery("#levelTxt").text());
       params = { level: currentLevel+1 };
       updateData(params);
       levelEnabled = true;
       jQuery("#level").show();
      });

   //Bind enableStart Event
    Crafty.bind("enableStart",function(){
       isGameStarted = false;
    });

    var isGameStarted = false;
    var levelEnabled = false;
    var  paused      = false;
    var level = parseInt(jQuery("#levelTxt").text());
    jQuery("#pause").hide();
    jQuery("#level").hide();

    jQuery("#play").click(function(e){
      if (e.originalEvent.detail == 0 || isGameStarted )  {
            e.preventDefault();
      }
      else {
            scrollLock = true;
            isGameStarted = true;
            var player = Crafty.e("Player");
            player.x = 100;
            player.y = 340; 
            var bot = Crafty.e("Bot");
            bot.x = 400;
            bot.y = 300; 
            bot.place(10,2,10,level);
            jQuery("#pause").show();
            jQuery("#level").hide();
      }
     });

      jQuery("#level").click(function(e){
        if (e.originalEvent.detail == 0 || !levelEnabled)  {
            e.preventDefault();
        }
        else {
            level++;
            jQuery("#levelTxt").text(level);
               
            scrollLock = true;
            levelEnabled = false;
            var player = Crafty.e("Player");
            player.x = 100;
            player.y = 340; 
            var bot = Crafty.e("Bot");
            bot.x = 400;
            bot.y = 300; 
            bot.place(10,2,10,level);
            jQuery("#level").hide();
        }
      });
      jQuery("#pause").click(function(e){
          if (e.originalEvent.detail == 0)  {
            e.preventDefault();
          }
          else{
            Crafty.trigger("PauseReset");
            if(!paused) {
              paused = true;
              jQuery(this).text("Resume");
              scrollLock = false;
            }
            else {
              paused = false;
              jQuery(this).text("Pause");
              scrollLock = true;
            }
          }             
        
      });

      var $window = $(window), previousScrollTop = 0, scrollLock = false;
      $window.scroll(function(event) {     
          if(scrollLock) {
              $window.scrollTop(previousScrollTop); 
          }

          previousScrollTop = $window.scrollTop();

      });
});

function updateData(params){
  $.ajax({
         method: "POST",
         url: "/character/updatedata",
         data: { data: params }
  })
  .done(function( msg ) {
      
 });
}
      

      