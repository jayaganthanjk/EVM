$(document).ready(function(){
    $.material.init();
    var image_data;

    function fixHeight()
    {
      var height = $(window).height();
      height = (75*height)/100;
      $('.content-wrapper-total').css('height',height-100);
    }

    function fillDiff(){
      $('ul .event-description:even').css('backgroundColor',"#DAD7D7");
      $('ul .event-description:odd').css('backgroundColor',"#F2F1F1");
    }

  fixHeight();

  $(window).resize(function(){
    fixHeight();
  })
  $(document).on('click','.close',function(){
    var id = $(this).parents('.model-display').attr('id');
    //console.log("close "+id);
    var option = '<option value="'+id+'">'+id+'</option>';
    $('#model-select').append(option);
    $(this).parents('.model-display').remove();    
  });

 $('#search').on('keyup',function(){
  var search = $(this).val().trim().toLowerCase();
    var models = [];

  $('.model-display').each(function(){
    models.push($(this).attr('id'));
  });

  $('#description-menu li.event-description').each(function(){
    var content = $(this).text().trim().toLowerCase();
    if(content.indexOf(search) == -1)
    {
      $(this).addClass('search-display');
      var i = $(this).index()+1;
      $.each(models,function(key,value){
        $('#'+value+' ul li:nth-child('+i+')').addClass('search-display');
      })
    }
    else{
      $(this).removeClass('search-display');
      var i = $(this).index()+1;
      var category = $(this).data('category');
      $description_category = $('#description-menu ul li.event-description[data-category="'+category+'"]');
      $description_category.each(function(){
        if(!$(this).hasClass('category-description'))
        {
          $(this).removeClass('search-display');
        }
      })
      $.each(models,function(key,value){
        $('#'+value+' ul li:nth-child('+i+')').removeClass('search-display');
        $headingElement = $('#'+value+' ul li[data-category="'+category+'"]');
        console.log($headingElement);
        $headingElement.each(function(){
          if(!$(this).hasClass('category-description'))
          {
            $(this).removeClass('search-display');
          }
        })
      })
    }
  })
 })

 $('#addToCompare').click(function(){
    if($('#model-select').val() === undefined )
    {
      alert("Invalid model. Refresh and try again");
    }
    if($('#model-select option').size() == 0)
    {
      alert("No models to choose");
    }
    else
    {
      //console.log($('#model-select').val());
      var val = $('#model-select').val();
      $('option[value="'+val+'"]').remove();
      createModelView(val);
      normaliseHeights();
    }
  });
    //Getting data from the file.
 $('#input_file').on('change', function(){
    var file = this.files[0];

    var reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      main_file_data = this.result;
      file_data = $.csv.toObjects(main_file_data);
      //console.log($.csv.toObjects(main_file_data));
      init();
    };
    reader.readAsText(file);
  });

 //Image file analysis start
 $('#image_file').on('change', function(){
    var file = this.files[0];

    var reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      //console.log(file);
      image_file_data = this.result;
      image_data = $.csv.toObjects(image_file_data);
     
      imageData(image_data);
      var image = findImageName("Basic","Model-8965");
      //console.log(image);
    };
    //console.log(file);
    reader.readAsText(file);
  });
  // Setting up for the popover
  $('.popover-with-html').popover({ html : true });
  $(".popover-with-html").popover({ trigger: "manual" });
  var flag=false;
  $(document).on({
    mouseenter: function () {
      flag=false;
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
        if(!flag)
        {
         $(this).popover("hide");
        }
    },
    click: function () {
        //stuff to do on mouse enter
        flag=!flag;
        //console.log($(this).attr('style'));
        $('.popover-with-html').popover({ html : true });
        
      //console.log("entered");
      //console.log($(this).data('bs.popover'));
      var img_src = $(this).data('src');
      $(this).data('bs.popover').options.content = "<div class=\"main-img\"><img style=\"width:100%;height:80%;\" src=\"img/"+img_src+"\"></img></div>";
      //console.log($(this).data('bs.popover'));
      $(this).popover("show");
    }
  }, ".image");

  $('html').on('click',function(e){
    if(typeof $(e.target).data('original-title')=='undefined' && !$(e.target).parents().is('.popover.in')) {
      $('[data-original-title]').popover('hide');
    }
  })
  function findDispProperty(check){
    if(check==true){ return "block"; }
    return "none";
  }
	
  function triggerData(){
  var count=0;
  var image_category_name="";
  $('.category').each(function(){
    var check = $(this).is(':checked');
    var disp_property = findDispProperty(check);
     var category = $(this).data('category');
    var sub_category = $(this).data('sub-category');
    if(!check)
    {
      //count=0;
      $('#all-category').prop('checked',false);
    }
    else
    {
      count++;
      if(typeof sub_category !== 'undefined')
    {
      //$('.event-description[data-sub-category="'+sub_category+'"]').css('display',disp_property);
      image_category_name=sub_category;
    }
    else
    { 
      //$('.event-description[data-category="'+category+'"]').css('display',disp_property);
       image_category_name=category;
    }
    }
    
    
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
  //console.log("count="+count);
    if(count==1)
    {
      $.each(model,function(key,value){
     $('div#'+value+' .model-image img').attr('src','img/'+findImageName(image_category_name,value));
    });
    }
    else
    {
      $.each(model,function(key,value){
        image_category_name = "Main";
     $('div#'+value+' .model-image img').attr('src','img/'+findImageName(image_category_name,value));
    });
    }
  }

  $('#back-to-top').click(function(){
    var body = $("html, body");
    body.animate({scrollTop:0}, '3000', 'swing', function() { });
  })

  $(document).on('click','.category',function(){
    var check = $(this).is(':checked');
    var category = $(this).data('category');
    var sub_category =  $(this).data('sub-category');

    
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
    triggerData();
  });

  var lastScrollLeft = 0;
  $('.model-menu').scroll(function() {
    var documentScrollLeft = $(this).scrollLeft();
    if (lastScrollLeft != documentScrollLeft) {
        lastScrollLeft = documentScrollLeft;
        $('.model-menu-below').scrollLeft(lastScrollLeft);
    }
  });
  /*
    else{
      console.log('scroll y');
      $('.model-menu .model-image-li').css('position','fixed');
      $('.model-menu .model-image-li').css('marginTop','-150px');
      $('.model-menu .model-heading').css('marginTop','150px');
    }
  });

  var lastScrollTop = 0;
  $('.content-wrapper-box').scroll(function(){
    var scrollTop = $(this).scrollTop();
    if(scrollTop != lastScrollTop)
    {
      console.log('scroll y');
      $('.model-menu .model-image-li').css('position','fixed');
      $('.model-menu .model-image-li').css('marginTop','-150px');
      $('.model-menu .model-heading').css('marginTop','150px');
    }
  })*/


  $('.category-check').click(function(){
    //$('#all-category').prop('checked',false);
  });

  $('#all-category').click(function(){
    var check = $(this).is(':checked');
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