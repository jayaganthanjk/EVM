$(function(){ 

  var file_data;
  var categories = [];
  var model = [];
  var image_data;

  $.material.init();
  //Image file analysis start
 
  // Getting image for given category and model name

  function findImageName(category, model)
  {
    var return_data;
    $.each(image_data, function(key,value){
      if(category == value.Category){
        $.each(value, function(image_key,image_value){
          if(image_key == model)
          {
            console.log(image_value);
            return_data = image_value;
          }
        })
      }
    });
    return return_data;
  }

    //Getting data from the file.
  $('#image_file').on('change', function(){
    var file = this.files[0];

    var reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      //console.log(file);
      image_file_data = this.result;
      image_data = $.csv.toObjects(image_file_data);
      console.log(image_data);
      var image = findImageName("Basic","Model-8965");
      console.log(image);
    };
    console.log(file);
    reader.readAsText(file);
  });



  //image file analysis end


  function findUnique(list)
  {
    var result = [];
    $.each(list, function(i, e) {
      if ($.inArray(e, result) == -1) result.push(e);
    });
    return result
  }

  function isValid(str)
  {
    if(typeof str == 'undefined')
    {
      return false;
    }
    else if(str.trim().length<1)
    {
      return false;
    } 
    return true;
  }

  function findSubCategory(category){
    sub_categories_result = [];
    sub_categories_list = [];
    for(var i=0;i<file_data.length;i++)
    {
      if(isValid(file_data[i].Category))
      {
        if(file_data[i].Category == category && isValid(file_data[i].SubCategory))
        { 
          sub_categories_list.push(file_data[i].SubCategory);
        }
      }
    }
    if(sub_categories_list.length > 0)
    {
      sub_categories_result = findUnique(sub_categories_list);
    }
    return sub_categories_result;
  }

  function findCategories(){
    for(var i=0;i<file_data.length;i++)
    {
      if(file_data[i].Category.trim().length > 0)
        categories.push(file_data[i].Category);
    }
    categories =  findUnique(categories); 
    //console.log(categories);  
  }

  function findDescription(category){
    description_result = [];
    $.each(file_data, function(key,value){
      if( isValid(file_data[key].Category) || isValid(file_data[key].Category))
      {
        if(file_data[key].Category == category || file_data[key].SubCategory == category)
          description_result.push(file_data[key].Description);
      }
    })
    return description_result;
  }

  function findModels(){
    $.each(file_data[1], function(key, element) {
      if(isValid(key) && key.toLowerCase().indexOf("model") != -1)
      {
        model.push(key);
      }
    });
  }

  function findModelDescription(model,category){
    var model_description_array = [];
    $.each(file_data, function(key,value){
      if( (isValid(file_data[key].Category) && file_data[key].Category == category) || (isValid(file_data[key].SubCategory) && file_data[key].SubCategory == category) )
      {
        $.each(file_data[key],function(k,e){
          if(isValid(k) && k == model)
          {
            model_description_array.push(e);
          }
        })
      }
    })
    return model_description_array;
  }


  //Getting data from the file.
  $('#input_file').on('change', function(){
    var file = this.files[0];

    var reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      main_file_data = this.result;
      file_data = $.csv.toObjects(main_file_data);
      console.log($.csv.toObjects(main_file_data));
      init();
    };
    reader.readAsText(file);
  });

  function buildCategoryMenu()
  {
    var checkbox_html_start = "<div class='checkbox category-list'><label><input type='checkbox' class='category-check category' ";
    var checkbox_html_end = "</label></div>";
    $.each( categories, function(key,value){
      var html_content = checkbox_html_start+ "data-category='" +value+ "' />"+value +checkbox_html_end;
      $('#categories-menu').append(html_content);
      if(findSubCategory(categories[key]).length > 0){
        $.each( findSubCategory(categories[key]), function(sub_key, sub_value){
          var html_content = checkbox_html_start+ "data-category='" +value+ "' data-sub-category='"+sub_value+"' />"+sub_value +checkbox_html_end;
          $('#categories-menu').append(html_content);
          $('#categories-menu div:nth-last-child(1)').last().addClass("sub-category event ");
        });
      }
    });
    $('.category-list').fadeIn(2000);
  }

  function fillCategoryDescription(category){
    var content_html_start = '<li class="list-group-item" data-category="';
    var content_html_end = '</li>';
    $.each( findDescription(category), function(key,value)
    {
      $('#description-menu ul').append(content_html_start+category+"\">"+value+content_html_end); 
      $('#description-menu ul li:nth-last-child(1)').last().addClass("text-info text-bold category-description event-description");      
    })
  }

  function fillSubCategoryDescription(category,sub_category){
    var content_html_start = '<li class="list-group-item" data-category="';
    var content_html_end = '</li>';
    var temp_description  = findDescription(sub_category);
    //console.log("descriptoin of "+sub_category+" "+temp_description);
    $.each( temp_description , function(key,value)
    {
      $('#description-menu ul').append(content_html_start+category+"\" data-sub-category=\""+sub_category+"\">"+value+content_html_end); 
      $('#description-menu ul li:nth-last-child(1)').last().addClass("text-info text-bold category-description event-description");      
    })
  }


  function fillModelDescription()
  {
    var content_html_start = '<li class="list-group-item" data-category="';
    var content_html_end = '</li>';
    $('#description-menu ul').append('<li class="list-group-item model-image-li">'+'<div class="model-image"><img src="img/barathbenz.jpg"></img></div>'+content_html_end);
    $('#description-menu ul').append('<li class="list-group-item" >Description</li>');
    $.each(categories, function(category_key, category_value){
      $('#description-menu ul').append(content_html_start+category_value+"\">"+category_value+content_html_end);
      $('#description-menu ul li:nth-last-child(1)').last().addClass("text-info text-bold event-description");
      $this = $('#description-menu ul');
      temp_sub_categories = findSubCategory(category_value);
      if( temp_sub_categories.length > 0 )
      {
        $.each( temp_sub_categories , function(sub_category_key, sub_category_value){
          $this.append(content_html_start+category_value+'" data-sub-category="'+sub_category_value+'">'+"<em>"+sub_category_value+"</em>"+content_html_end);
          $('#description-menu ul li:nth-last-child(1)').last().addClass("text-info sub-category-display event-description");
          //console.log("filling sub category for "+sub_category_value);
          fillSubCategoryDescription(category_value, sub_category_value);
        })
      }
      else
      {
        fillCategoryDescription(category_value);
      }
    })
  }

  function fillCategoryModelDescription(category, model_name)
  {
    var content_html_start = '<li class="list-group-item" data-category="';
    var content_html_end = '</li>';
    $.each( findModelDescription(model_name, category), function(key,value)
    {
      if($('input[data-category="'+category+'"]').is(':checked'))
      {
        $('#'+model_name+' ul').append(content_html_start+category+"\" style=\"display:block;\">"+value+content_html_end); 
      }
      else{
        $('#'+model_name+' ul').append(content_html_start+category+"\">"+value+content_html_end); 
      }
      $('#'+model_name+' ul li:nth-last-child(1)').last().addClass("text-info text-bold category-description event-description");      
    })
  }

  function fillSubCategoryModelDescription(category, sub_category, model_name)
  {
    var content_html_start = '<li class="list-group-item" data-category="';
    var content_html_end = '</li>';
    var temp_description  = findModelDescription(model_name, sub_category);
    //console.log("descriptoin of "+sub_category+" "+temp_description);
    $.each( temp_description , function(key,value)
    {
      if($('input[data-sub-category="'+sub_category+'"]').is(':checked'))
      {
        $('#'+model_name+' ul').append(content_html_start+category+"\" data-sub-category=\""+sub_category+"\" style=\"display:block;\">"+value+content_html_end); 
      }
      else
      {
        $('#'+model_name+' ul').append(content_html_start+category+"\" data-sub-category=\""+sub_category+"\" style='background-url:'img/check.gif';'>"+value+content_html_end); 
      }
      $('#'+model_name+' ul li:nth-last-child(1)').last().addClass("text-info text-bold category-description event-description");      
    })  
  }

  function fillSingleModelDescription(model_name)
  {

    var content_html_start = '<li class="list-group-item" data-category="';
    var content_html_end = '<div class="small-img pull-right popover-with-html image" data-container="body" data-trigger="manual" data-toggle="popover" data-placement="left" data-content=""></div></li>';
    var model_image_content_html_end = '<div style="background-image:url(\'img/'+findImageName("Main",model_name)+'\');background-size:contain;background-repeat:no-repeat;float:left;" class="small-img popover-with-html image" data-container="body" data-trigger="manual" data-toggle="popover" data-placement="left" data-content=""></div>';
    $('#'+model_name+' ul').append('<li class="list-group-item model-image-li"><div class="model-image"><img src="img/'+findImageName("Main",model_name)+'"></img></div></li>');
    $('#'+model_name+' ul').append('<li class="list-group-item text-success model-heading" >'+model_name+'<span class="pull-right"> <div class="close">X</div></span></li>');

    $.each( categories , function(category_key,category_value){
      if($('input[data-category="'+category_value+'"]').is(':checked'))
      {
        image_content_html_end = '<div style="background-image:url(\'img/'+findImageName(category_value,model_name)+'\');background-size:contain;background-repeat:no-repeat;" class="small-img pull-right popover-with-html image" data-container="body" data-trigger="manual" data-toggle="popover" data-placement="left" data-content=""></div></li>';
        $('#'+model_name+' ul').append(content_html_start+category_value+"\" style=\"display:block;\" >"+category_value+image_content_html_end);
      }
      else
      {
        $('#'+model_name+' ul').append(content_html_start+category_value+"\" >"+category_value+content_html_end);
      }
      $('#'+model_name+' ul li:nth-last-child(1)').last().addClass("event-description");
      $this = $('#'+model_name+' ul');
      temp_sub_categories = findSubCategory(category_value);
      if( temp_sub_categories.length > 0 )
      {
        $.each( temp_sub_categories , function(sub_category_key, sub_category_value){
          if($('input[data-sub-category="'+sub_category_value+'"').is(':checked'))
          {
            image_content_html_end = '<div style="background-image:url(\'img/'+findImageName(sub_category_value,model_name)+'\');background-size:contain;background-repeat:no-repeat;" class="small-img pull-right popover-with-html image" data-container="body" data-trigger="manual" data-toggle="popover" data-placement="left" data-content=""></div></li>';
            $this.append(content_html_start+category_value+'" data-sub-category="'+sub_category_value+'" style="display:block;">'+"<em>"+sub_category_value+"</em>"+image_content_html_end);
          }
          else
          {
            $this.append(content_html_start+category_value+'" data-sub-category="'+sub_category_value+'">'+"<em>"+sub_category_value+"</em>"+content_html_end);
          }
          $('#'+model_name+' ul li:nth-last-child(1)').last().addClass("text-info sub-category-display event-description");
          //console.log("filling sub category for "+sub_category_value);
          fillSubCategoryModelDescription(category_value, sub_category_value, model_name);
        })
      }
      else
      {
        fillCategoryModelDescription(category_value, model_name);
      }
    })
  }

  function createModelView(model_name)
  {
    $('.model-list-view').append('<div class="model-display col-md-3" id='+model_name+'><ul class="list-group shadow-z-2"></ul></div>');
    fillSingleModelDescription(model_name);
  }

  function fillModelOptions()
  {
    $.each( model, function(key,value){
      var option = '<option value="'+value+'">'+value+'</option>';
      $('#model-select').append(option);
    })
    $('#model-select').removeAttr('disabled');
  }

  $('#addToCompare').click(function(){
    if($('#model-select option').size() ==0)
    {
      alert("No models to choose");
    }
    else
    {
      console.log($('#model-select').val());
      var val = $('#model-select').val();
      $('option[value="'+val+'"]').remove();
      createModelView(val);
    }
  });

  $(document).on('click','.close',function(){
    var id = $(this).parents('.model-display').attr('id');
    console.log("close "+id);
    var option = '<option value="'+id+'">'+id+'</option>';
    $('#model-select').append(option);
    $(this).parents('.model-display').remove();    
  })

  function init(){
    findCategories();
    findModels();
    fillModelOptions();
    buildCategoryMenu();
    fillModelDescription();
    $('#all-category').click();
    $.material.init();
    //createModelView();
  }




})