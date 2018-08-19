(function(){
  var myChart = echarts.init(document.getElementById('main1'));

  var option = {
    xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
        type: 'value',
    },
    tooltip:{
        trigger: 'axis',
    },
    title: {
      text: '动态数据',
     
  },
    legend: {
      data:['最新成交价'],
  },
    series: [{
        data: [120, 200, 150, 80, 70, 110],
        name:'最新成交价',
        type: 'bar'
    }]
  };

  myChart.setOption(option);

  


 var chart = echarts.init(document.getElementById('main2'));

  option = {
    title : {
        text: '某站点用户访问来源',
        
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
  };

  chart.setOption(option);


  
})()
