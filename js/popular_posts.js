<!--page counter part-->
function addCount (Counter) {
        url=$('.article-date').attr('href').trim();
        title = $('.article-title').text().trim();
        var query=new AV.Query(Counter);
        //use url as unique idnetfication
        query.equalTo("url",url);
        query.find({
            success: function(results){
                if(results.length>0)
                {
                    var counter=results[0];
                    counter.fetchWhenSave(true); //get recent result
                    counter.increment("time");
                    counter.save();
                }
                else
                {
                    var newcounter=new Counter();
                    newcounter.set("title",title);
                    newcounter.set("url",url);
                    newcounter.set("time",1);
                    newcounter.save(null,{
                        success: function(newcounter){
                        //alert('New object created');
                        },
                        error: function(newcounter,error){
                        alert('Failed to create');
                        }
                        });
                }
            },
            error: function(error){
                //find null is not a error
                alert('Error:'+error.code+" "+error.message);
            }
        });
}
$(function(){
        var Counter=AV.Object.extend("Counter");
        //only increse visit counting when intering a page
        if ($('.article-title').length == 1)
           addCount(Counter);
        var query=new AV.Query(Counter);
        query.descending("time");
        // the sum of popular posts
        query.limit(10); 
        query.find({
            success: function(results){
                    for(var i=0;i<results.length;i++)    
                    {
                        var counter=results[i];
                        title=counter.get("title");
                        url=counter.get("url");
                        time=counter.get("time");
                        // add to the popularlist widget
                        showcontent=title+" ("+time+")";
                        //notice the "" in href
                        $('.popularlist').append('<li><a href="'+url+'">'+showcontent+'</a></li>');
                    }
                },
            error: function(error){
                alert("Error:"+error.code+" "+error.message);
            }
            }
        )
        });
