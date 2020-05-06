function button_first(){
    var a = document.getElementById('a_element').value;
    var b = document.getElementById('b_element').value;
    if (a < 0 || b < 0){
        alert('Ошибка!');
    }
    else{
        document.getElementById('result_first').innerHTML = (Math.PI * a * b).toFixed(2);
    }
}

function button_clear_1(){
    document.getElementById('a_element').value = '';
    document.getElementById('b_element').value = '';
    document.getElementById('result_first').innerHTML = '';
}

function factorial(n) {
    return (n != 1) ? n * factorial(n - 1) : 1;
}

function button_second(){
    var x = document.getElementById('x_element').value;
    if (x >= 1){
        alert('Ошибка!');
    }
    else{
        var result = 1;
        var term = x;
        var i = 1;
        while (Math.abs(term) >= 0.0003){
            term = Math.pow(x, i)/factorial(i)
            result = result + Math.pow(x, i)/factorial(i)
            i = i + 1;
        }
        document.getElementById('result_second').innerHTML = result.toFixed(4);
    }
}

function button_clear_2(){
    document.getElementById('x_element').value = '';
    document.getElementById('result_second').innerHTML = '';
}

function button_three(){
    address = document.getElementsByClassName('field');
    var val = [];
    for (i = 0; i < address.length; i++){
        val.push(address[i].value);
    }

    for (l = 0; l < 8; l++){
        for (i = l * 8; i < l * 8 + 7; i++){
            for (j = i + 1; j < l * 8 + 8; j++){
                if (Number(val[i]) > Number(val[j])){
                    var buf = val[i];
                    val[i] = val[j];
                    val[j] = buf;
                }
            }
        }
    }

    for (i = 0; i < address.length; i++){
        address[i].value = val[i];
    }
}

function button_gen(){
    var address = document.getElementsByClassName('field');
    var min = document.getElementById('min').value;
    var max = document.getElementById('max').value;
    for (i = 0; i < address.length; i++){
        address[i].value = Math.round(min - 0.5 + Math.random() * (max - min));
    }
}

function compare(a, b) {
    return b - a;
}

function getRandomInt(min, max){
    return Math.round(min - 0.5 + Math.random() * (max - min));
}

function getArray(n){
    var min = document.getElementById('mini').value;
    var max = document.getElementById('maxi').value;

    var list = [];
    
    if (min >= max){
        alert('Ошибка!');
        return false;
    }

    for (i = 0; i < n * n; i++){
        list.push(getRandomInt(min, max));
    }

    return getResultArray(list);
}

function getResultArray(list){
    if (list.length > 0){
        return list.sort(compare);
    }
}

function resultArray(){
    var n = document.getElementById('n_element').value;
    
    if (n <= 0){
        alert('Ошибка!');
        return false;
    }

    var sorted_list = getArray(n);
    var next = 0;
    var matrix = [];

    for (i = 0; i < n; i++){
        matrix.push([]);
    }

    for (i = 0; i < n; i++){
        if (i % 2 == 1){
            for (j = n - 1; j >= 0; j--){
                matrix[j][i] = sorted_list[next++];
            }
        }
          
        if (i % 2 == 0){
            for (j = 0; j < n; j++){
                matrix[j][i] = sorted_list[next++];
            }
        }
    }

    var table = '<table>';
        for (i = 0; i < n; i++){
            table = table + '<tr>';
                for (j = 0; j < n; j++){
                    table = table + '<td>' + " " + matrix[i][j] + " " + '</td>'; 
              }
              table = table + '</tr>';
        }
        table == table + '</table>';
        
    document.getElementById('table').innerHTML = table;
}