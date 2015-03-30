$(function () {

  function appendChartOption(option_description)
  {
    var option = "<option value=\""+option_description+"\">"+option_description+"</option>";
    for(var i=1; i<6;i++)
    {
      $('#chart-option-'+i).append(option);
    }
  }
  
  function fillDescriptionForGraph()
  {
    var a = [];
    var model = getModelsForGraph();
    model = model[0];
    $('.category-description').each(function(){
      if($(this).css('display') == "block" && !($(this).parents('.model-display').length > 0))
      {
        if(typeof $(this).data('sub-category') != 'undefined')
        {
          return_data = findIndividualSubCategoryModelDescription(model, $(this).text(),$(this).data('category'),$(this).data('sub-category'));
          var result = parseInt(return_data);
          if(!isNaN(result))
          {
            a.push($(this).text());
          }
        }
        else
        {
          return_data = findIndividualModelDescription(model, $(this).text(), $(this).data('category'));
          var result = parseInt(return_data);
          if(!isNaN(result))
          {
            a.push($(this).text());
          }
        }        
      }
    })
    var unique = a.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    $.each(unique,function(key,value){
      appendChartOption(value);
    })
  }
  function getModelsForGraph()
  {
    var models_for_graph = [];
    $('.model-display').each(function(){
      var id = $(this).attr('id');
      if(!(id.indexOf('below') != -1))
      {
        models_for_graph.push(id);
      }
    })
    return models_for_graph;
  }

  function findAggregateDescription(model,aggregate,category,sub_category)
  {
    if(sub_category.length>1)
    {
      return_data = findIndividualSubCategoryModelDescription(model,aggregate,category,sub_category);
    }
    return return_data;
  }

  function fetchSelectedCategories()
  {
    var category_sub_category_group = [];
    $('.category').each(function(){
      if($(this).is(':checked'))
      {
        var category = $(this).data('category');
        var sub_category = $(this).data('sub-category');
        var category_sub_category_element = [];
        if(typeof sub_category != 'undefined')
        {
          category_sub_category_element.push(category);
          category_sub_category_element.push(sub_category);
          category_sub_category_group.push(category_sub_category_element);
        }
      }
    });
    return category_sub_category_group;
  }

  function analyseChartAggregateOptions(models_for_graph)
  {
    var aggregates = [],categories = [];
    var error_flag = 0;
    $('.chart-option').each(function()
    {
      var individual_aggregate = $(this).val();
      if(individual_aggregate != null)
      {
        categories = fetchSelectedCategories();
        $.each(categories, function(k,v){
          var aggregate_data = [];
          $.each(models_for_graph, function(key,value){
            model_description_value = findAggregateDescription(value,individual_aggregate,v[0],v[1]);
            model_description_value = parseInt(model_description_value);
            if(isNaN(model_description_value))
            {
              error_flag=1;
            }
            else
            {
              aggregate_data.push(parseInt(model_description_value));          
            }
          });
          aggregates.push({
            name: v[1],
            data: aggregate_data,
            stack: individual_aggregate
          });
        })        
      }
    });
    if(error_flag == 1)
    {
      return 0;
    }
    else
    {
      return aggregates;
    }
  }
  function showGraph(models,aggregates)
  {
    $('#chart-wrapper').remove();
    $('#chart-wrapper-parent').append('<div id="chart-wrapper"></div>');

 $('#chart-wrapper').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Comparison Chart'
        },

        xAxis: {
            categories: models
        },

        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'some'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    textOverflow: 'clip',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    align: 'center',
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black',
                    },                    
                }
            }
        },

        series: aggregates
    });
  }

  // Function to display graph based on the analytics
  $('#draw-graph').click(function(){
      showLoader();
      var models_for_graph = getModelsForGraph();
      var aggregates_for_graph = [];
      var display_graph_flag;
      aggregates_for_graph = analyseChartAggregateOptions(models_for_graph);
      if(aggregates_for_graph.length == 0)
      {
        alert("No aggregate chosen");
      }
      else{
        if(aggregates_for_graph == 0)
        {
          alert("Invalid aggregate choosen! Not an number!");
        }
        else{
          showGraph(models_for_graph,aggregates_for_graph);
          $('.highcharts-contextmenu div:gt(1)').delay(1000).remove();
        }
        // For removing highcharts.com at the bottom of the graph
        $('text[text-anchor="end"]').remove();
        $('.chart-option').each(function()
        {
          $(this).find('option:eq(0)').prop('selected', true);          
        })
      }
      hideLoader();
  });
  // Function to display graph based on the analytics end

  $('#chart-modal-btn').click(function(){
    $('#chart-modal').modal('toggle');
    showLoader();
    if($('.model-display').size() == 0)
    {
      $('#no-models-error-msg').fadeIn();
      $('.chart-option').attr('disabled',true);
    }
    else{
      $('.chart-option').removeAttr('disabled');
      $('#no-models-error-msg').fadeOut();
      fillDescriptionForGraph();
    }
    hideLoader();
  });

  $('#chart-modal').on('hidden.bs.modal', function () {
    // do something…
    $('.chart-option option:enabled').remove();
  })
})