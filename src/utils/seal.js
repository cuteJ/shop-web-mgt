
export function statusSealRect(id, statusName, color){
  let canvas = document.getElementById(id);
  let context = canvas.getContext('2d');
  // 绘制印章边框
  let width=canvas.width/2;
  let height=canvas.height/2;

  let x = canvas.width/6
  let y = canvas.height/4

  context.globalAlpha = 0.5;
  context.lineWidth=4;
  context.strokeStyle=color || "#f00";
  if(!color){
  context.shadowColor = '#d53';
  context.shadowBlur = 10;
  }
  context.lineJoin = 'bevel';
  context.rotate(10 * Math.PI / 180);
  context.strokeRect(x, y, x * 4, y * 2);

  // 状态名称
  context.font = '22px Helvetica';
  context.textBaseline = 'middle';//设置文本的垂直对齐方式
  context.textAlign = 'center'; //设置文本的水平对对齐方式
  context.lineWidth=1;
  context.fillStyle = color || '#f00';
  context.fillText(statusName,width,height);
}

export function statusSeal(id, statusName){
  let canvas = document.getElementById(id);
  let context = canvas.getContext('2d');

  // 绘制印章边框
  let width=canvas.width/2;
  let height=canvas.height/2;
  context.lineWidth=4;
  context.strokeStyle="#f00";
  context.shadowColor = '#d53';
  context.shadowBlur = 10;
  context.beginPath();
  context.arc(width,height,45,0,Math.PI*2);
  context.stroke();

  // 绘制印章名称
  context.font = '22px Helvetica';
  context.textBaseline = 'middle';//设置文本的垂直对齐方式
  context.textAlign = 'center'; //设置文本的水平对对齐方式
  context.lineWidth=1;
  context.fillStyle = '#f00';
  context.fillText(statusName,width,height);
}

// export function createSeal(id,company,name){
 
//   var canvas = document.getElementById(id);
//   var context = canvas.getContext('2d');

//   // 绘制印章边框
//   var width=canvas.width/2;
//   var height=canvas.height/2;
//   context.lineWidth=7;
//   context.strokeStyle="#f00";
//   context.beginPath();
//   context.arc(width,height,110,0,Math.PI*2);
//   context.stroke();

//   //画五角星
//   create5star(context,width,height,30,"#f00",0);

//   // 绘制印章名称
//   context.font = '22px Helvetica';
//   context.textBaseline = 'middle';//设置文本的垂直对齐方式
//   context.textAlign = 'center'; //设置文本的水平对对齐方式
//   context.lineWidth=1;
//   context.fillStyle = '#f00';
//   context.fillText(name,width,height+65);

//   // 绘制印章单位
//   context.translate(width,height);// 平移到此位置,
//   context.font = '30px Helvetica'
//   var count = company.length;// 字数
//   var angle = 4*Math.PI/(3*(count - 1));// 字间角度
//   var chars = company.split("");
//   var c;
//   for (var i = 0; i < count; i++){
//       c = chars[i];// 需要绘制的字符
//       if(i==0)
//           context.rotate(5*Math.PI/6);
//       else
//         context.rotate(angle);
//       context.save();
//       context.translate(90, 0);// 平移到此位置,此时字和x轴垂直
//       context.rotate(Math.PI/2);// 旋转90度,让字平行于x轴
//       context.fillText(c,0, 5);// 此点为字的中心点
//       context.restore();
//   }

//   //绘制五角星
//   /**
//    * 创建一个五角星形状. 该五角星的中心坐标为(sx,sy),中心到顶点的距离为radius,rotate=0时一个顶点在对称轴上
//    * rotate:绕对称轴旋转rotate弧度
//    */
//   function create5star(context,sx,sy,radius,color,rotato){
//       context.save();
//       context.fillStyle=color;
//       context.translate(sx,sy);//移动坐标原点
//       context.rotate(Math.PI+rotato);//旋转
//       context.beginPath();//创建路径
//       var x = Math.sin(0);
//       var y= Math.cos(0);
//       var dig = Math.PI/5 *4;
//       for(var i = 0;i< 5;i++){//画五角星的五条边
//        var x = Math.sin(i*dig);
//        var y = Math.cos(i*dig);
//        context.lineTo(x*radius,y*radius);
//       }
//       context.closePath();
//       context.stroke();
//       context.fill();
//       context.restore();
//   }
// }
