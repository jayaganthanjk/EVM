$(document).ready(function(){
    function fillDiff(){
    $('ul .event-description:even').css('backgroundColor',"#DAD7D7");
    $('ul .event-description:odd').css('backgroundColor',"#F2F1F1");
  }


  // Setting up for the popover
  $('.popover-with-html').popover({ html : true });
  $(".popover-with-html").popover({ trigger: "manual" });
  $(document).on({
    mouseenter: function () {
        //stuff to do on mouse enter
        console.log($(this).attr('style'));
        $('.popover-with-html').popover({ html : true });
        
      console.log("entered");
      console.log($(this).data('bs.popover'));
      var img_src = $(this).data('src');
      $(this).data('bs.popover').options.content = "<div class=\"main-img\"><img style=\"width:100%;height:80%;\" src=\"img/"+img_src+"\"></img></div>";
      console.log($(this).data('bs.popover'));
      $(this).popover("show");
    },
    mouseleave: function () {
        //stuff to do on mouse leave
      $(this).popover("hide");
    }
  }, ".image");


  function findDispProperty(check){
    if(check==true){ return "block"; }
    return "none";
  }
	
  function triggerData(){

  $('.category').each(function(){
    var check = $(this).is(':checked');
    var disp_property = findDispProperty(check);
    if(!check)
    {
      $('#all-category').prop('checked',false);
    }
    var category = $(this).data('category');
    var sub_category = $(this).data('sub-category');
    if(typeof sub_category !== 'undefined')
    {
      $('.event-description[data-sub-category="'+sub_category+'"]').css('display',disp_property);
    }
    else
    { 
      $('.event-description[data-category="'+category+'"]').css('display',disp_property);
    }
    //fillDiff();
  });

  }

  $('#back-to-top').click(function(){
    var body = $("html, body");
    body.animate({scrollTop:0}, '3000', 'swing', function() { });
  })

  $(document).on('click','.category',function(){
    var check = $(this).is(':checked');
    var category = $(this).data('category');
    var sub_category =  $(this).data('sub-category');

    triggerData();
    var disp_property = findDispProperty(check);
    if(typeof sub_category != 'undefined')
    {
      $('.event-description[data-sub-category="'+sub_category+'"]').css('display',disp_property);
    }
    else
    {
      $('.event-description[data-category="'+category+'"').css('display',disp_property);
      $('.category[data-category="'+category+'"').prop('checked',check);

    }
    //fillDiff();

  });


  $('.category-check').click(function(){
    //$('#all-category').prop('checked',false);
  });

  $('#all-category').click(function(){
    var check = $(this).is(':checked');
    console.log(check);
    if(check)
    {
      $('.category').prop('checked',true);
    }
    else{
      $('.category').prop('checked',false);
    }
    triggerData();
  })

})