clear
clc 
time.year = '2021';
time.month = '10';
time.day = '02';
time.date = strcat(num2str(time.year),'-',num2str(time.month),'-',num2str(time.day));
time.nextdate = strcat(num2str(time.year),'-',num2str(time.month),'-',num2str(time.day+1));

time.hour = '00';
time.minute = '01';
time.second = '00';
time.time = strcat(time.hour,':',time.minute,':',time.second);

url = strcat('https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND=%2710%27&OBJ_DATA=%27NO%27&MAKE_EPHEM=%27YES%27&EPHEM_TYPE=%27OBSERVER%27&CENTER=%27500@399%27&START_TIME=%27',time.date,'%20',time.time,'%27&STOP_TIME=%27',time.nextdate,'%27&STEP_SIZE=%271%20d%27&QUANTITIES=%271,20,43%27');
options = weboptions("ContentType", "text");
html = webread(url);