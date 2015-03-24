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
    $('.category-description').each(function(){
      if($(this).css('display') == "block" && !($(this).parents('.model-display').length > 0))
      {
        a.push($(this).text());
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

  function findAggregateDescription(model,aggregate)
  {
    var return_data;
    if(aggregate.split('`category').length>1)
    {
      var aggregate_temp_arr = aggregate.split('`category');
      return_data = findIndividualModelDescription(model,aggregate_temp_arr[0],aggregate_temp_arr[1]);
    }
    else{
      var aggregate_temp_arr = aggregate.split('`sub-category');
      return_data = findIndividualSubCategoryModelDescription(model,aggregate_temp_arr[0],aggregate_temp_arr[1]);
    }
    return return_data;
  }

  function analyseChartAggregateOptions(models_for_graph)
  {
    var aggregates = [];
    var error_flag = 0;
    $('.chart-option').each(function()
    {
      var individual_aggregate = $(this).val();
      if(individual_aggregate != null)
      {
        var aggregate_data = [];
        $.each(models_for_graph, function(key,value){
          var model_description_value = findAggregateDescription(value,individual_aggregate);
          model_description_value = parseInt(model_description_value);
          if(isNaN(model_description_value))
          {
            error_flag=1;
          }
          else
          {
            aggregate_data.push(parseInt(model_description_value));          
          }
        })
        individual_aggregate = individual_aggregate.replace('`category','-');
        individual_aggregate = individual_aggregate.replace('`sub-category','-');
        aggregates.push({
          name: individual_aggregate,
          data: aggregate_data
        });
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
            text: 'Comparison chart'
        },
        xAxis: {
            categories: models
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total fruit consumption'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
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
  });
  // Function to display graph based on the analytics end

  $('#chart-modal-btn').click(function(){
    $('#chart-modal').modal('toggle');
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
  })

  $('#chart-modal').on('hidden.bs.modal', function () {
    // do something…
    $('.chart-option option:enabled').remove();
  })
})