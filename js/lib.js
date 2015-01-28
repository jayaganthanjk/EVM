
function normaliseHeights()
{
  var length = $('#description-menu ul li').size();
  var models = [];

  $('.model-display').each(function(){
    models.push($(this).attr('id'));
  })

  for(var i=1;i<=length;i++)
  {
    var height = $('#description-menu ul li:nth-child('+i+')').css('height');
    $.each(models,function(key,value){
      $('#'+value+' ul li:nth-child('+i+')').css('height',height);
    })
  }
}
