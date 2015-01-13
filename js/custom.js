$(document).ready(function(){

  $.material.init();
  var main_file_data = [];
  var file_lines = [];
  var categories = [];
  var sub_categories = [];
  var description = [];
  var models = [];
  var model = [];
  var category_index, sub_category_index, description_index, row_index;


  //Finding whether its a valid category to be included or not
  function isValidCategory(category_temp)
  {
    if(typeof category_temp != 'undefined')
    {
      if(category_temp.length > 0)
      {
        return true;
      }
    }
    return false;
  }

  //Extracting the categories
  function extractCategories(index, sub_index){
    index = parseInt(index);
    var set = false;
    var set_sub_category = false;
    var temp_sub_category=[];
    var temp_category_description = [];
    var temp_sub_category_description = [];
    var temp_description = [];
    var temp_model = [];
    for(var i=0; i<file_lines.length; i++)
    {
      var cells = file_lines[i].split(',');
      if( isValidCategory(cells[index]) && i !== row_index )
      {
        if(cells[index].toLowerCase().trim() == "category" ){}
        else{
          categories.push(cells[index]);
          if(set)
          {
            sub_categories.push(temp_sub_category);


            if(temp_sub_category_description.length > 0)
            {
              temp_sub_category_description.push(temp_description);
              temp_category_description.push(temp_sub_category_description);
            }
            else{
              temp_category_description.push(temp_description);
            }
            description.push(temp_category_description);
            

            temp_category_description = [];
            temp_sub_category_description = [];
            temp_description = [];


            temp_sub_category = [];
          }
        set = true;
        }
      }
      if( isValidCategory(cells[sub_index]) && i!=row_index)
      {
        temp_sub_category.push(cells[sub_index]);
        if(set_sub_category)
        {       
          temp_sub_category_description.push(temp_description);
          temp_description = [];
        }
        set_sub_category = true;
      }
      if( isValidCategory(cells[description_index]) && i !== row_index ){
        temp_description.push(cells[description_index]);
      }
    }
    var category_length = categories.length - 1;
    sub_categories.push(temp_sub_category);
    
    if(temp_sub_category_description.length > 0)
    {
      temp_sub_category_description.push(temp_description);
      temp_category_description.push(temp_sub_category_description);
    }
    else{
      temp_category_description.push(temp_description);
    }
    description.push(temp_category_description);
  
  }

  //Finds whether the heading strings are present
  function findHit(str){
    str = str.toLowerCase().trim();
    if(typeof str != 'undefined')
    {
      if(str.indexOf("category") != -1 && str.indexOf("sub") != -1 && str.indexOf("description") != -1){
        return 3;
      } 
      else {
        return 0;
      }
    }
    return 0;
  }

  //Finding the line which contains the headings
  function findColumnHeadings(){
    for(var i=0;i<6;i++)
    {
      if(findHit(file_lines[i]) == 3){
        row_index = i;
        break;
      }
    }
    var cells = file_lines[row_index].split(',');
    var found_headings_count = 0;
    $.each( cells, function(key,value){
      value = value.toLowerCase().trim();
      if(found_headings_count < 3)
      {
        if(value == "category"){
          category_index = key;
          found_headings_count++;
        } 
        else if( value.indexOf("sub") != -1 && value.indexOf("category") != -1 )
        {
          sub_category_index = key;
          found_headings_count++;
        }
        else if( value.indexOf("descrip")  != -1){
          description_index = key;
          found_headings_count++;
        }
      }
      else{
        models.push(value);
      }
    })
  }

  //Creates the left hand side menu bar items
  function createCategoriesMenu()
  {
    var checkbox_html_start = "<div class='checkbox category-list'><label><input type='checkbox' class='category-check category' ";
    var checkbox_html_end = "</label></div>";
    $.each( categories, function(key,value){
      var html_content = checkbox_html_start+ "data-category='" +value.toLowerCase()+ "' />"+value +checkbox_html_end;
      $('#categories-menu').append(html_content);
      if(sub_categories[key].length > 0){
        $.each( sub_categories[key], function(sub_key, sub_value){
          var html_content = checkbox_html_start+ "data-category='" +value.toLowerCase()+ "' data-sub-category='"+sub_value.toLowerCase()+"' />"+sub_value +checkbox_html_end;
          $('#categories-menu').append(html_content);
          $('#categories-menu div:nth-last-child(1)').last().addClass("sub-category event ");
        });
      }
    });
    $('.category-list').fadeIn(2000);
  }

  //Create description view
  function createDescriptionView(){
    var content_html_start = '<li class="list-group-item" data-category="';
    var content_html_end = '</li>';
    $this = $('#description-menu ul');
    for(i=0;i<categories.length;i++)
    {
      $this.append(content_html_start+categories[i].toLowerCase()+'">'+"<strong>"+categories[i]+"</strong>"+content_html_end);
      $('#description-menu ul li:nth-last-child(1)').last().addClass("text-info text-bold event-description");
      if(sub_categories[i].length==0)
      {
        for(k=0;k<description[i][0].length;k++)
        {
          $this.append(content_html_start+categories[i].toLowerCase()+'">'+description[i][0][k]+content_html_end);
          $('#description-menu ul li:nth-last-child(1)').last().addClass("text-info text-bold category-description event-description");
        }
      }
      else
      {
        var length_description = description[i][0].length;
        for(k=0;k<length_description;k++){
          
          $this.append(content_html_start+categories[i].toLowerCase()+'" data-sub-category="'+sub_categories[i][k].toLowerCase()+'">'+"<em>"+sub_categories[i][k]+"</em>"+content_html_end);
          $('#description-menu ul li:nth-last-child(1)').last().addClass("text-info sub-category-display event-description");

          for(l=0;l<description[i][0][k].length;l++){
            $this.append(content_html_start+categories[i].toLowerCase()+'" data-sub-category="'+sub_categories[i][k].toLowerCase()+'">'+description[i][0][k][l]+content_html_end);
            $('#description-menu ul li:nth-last-child(1)').last().addClass("text-info text-bold sub-category-description event-description");
          }
        }
      }
    }
  }

  //Storing details of the file
  function inferFile()
  {
    findColumnHeadings();
    console.log(models);
    console.log(description);
    extractCategories(category_index, sub_category_index);
    createCategoriesMenu();
    createDescriptionView();
  }

  //Getting data from the file.
  $('#input_file').on('change', function(){
    var file = this.files[0];

    var reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      main_file_data = this.result;
      // By lines
      var lines = this.result.split('\n');
      for(var line = 0; line < lines.length; line++){
        file_lines.push(lines[line]);
      }
      inferFile();
    };
    reader.readAsText(file);
  });



})