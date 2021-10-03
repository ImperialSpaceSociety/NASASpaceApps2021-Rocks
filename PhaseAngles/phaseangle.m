clear 
close all
clc
% Example: Asteroid Bennu at 2021-Oct-02 00:00 (JPL Horizons Ephemerides)
% Actual phase angle = 0.9585 (degrees) - PHASE angle & Bisector (43)
% Right Ascension (HH:MM:SS) and Declination (DD:MM:SS) - Astrometric (1)
% Range/Distance (AU) - Observer range & range rate (20)

% Asteroid data - can be user input (based on astronomic observation)
ast.ra = 188.78844;
ast.dec = -4.33168;
ast.r = 2.211861;

% Sun data - obtained via JPL Horizons API (input = date/time for Sun
% ephemerides)
sun.ra_hms = [12 32 03.55];     % in hours minutes seconds
sun.dec_dms = [-03 27 30.4];    % in degrees minutes seconds
sun.r = 1.000993;
% Convert to decimal degrees
sun.ra = sun.ra_hms(1)*15 + sun.ra_hms(2)/4 + sun.ra_hms(3)/240;
if sun.dec_dms(1) < 0
    sun.dec = sun.dec_dms(1) - sun.dec_dms(2)/60 - sun.dec_dms(3)/3600;
else
    sun.dec = sun.dec_dms(1) + sun.dec_dms(2)/60 + sun.dec_dms(3)/3600;
end

% Vector format (Geocentric)
% x = vernal equinox, z = north
Ra = ast.r*[cosd(ast.ra);sind(ast.ra);sind(ast.dec)];
Rs = sun.r*[cosd(sun.ra);sind(sun.ra);sind(sun.dec)];
R = Ra-Rs;

% Calculate phase angle (degrees)
alpha = acosd(dot(R,Ra)/(norm(R)*norm(Ra)));

% Plot diagram
plot3(0,0,0,'.b','MarkerSize',40);
hold on
quiver3(0,0,0,Ra(1),Ra(2),Ra(3),0,'k');
quiver3(0,0,0,Rs(1),Rs(2),Rs(3),0,'k');
quiver3(Rs(1),Rs(2),Rs(3),R(1),R(2),R(3),0,'k');
plot3(Ra(1),Ra(2),Ra(3),'.k','MarkerSize',40);
plot3(Rs(1),Rs(2),Rs(3),'.y','MarkerSize',40);
text(Ra(1)/2,Ra(2)/2,Ra(3)/2,'R_A');
text(Rs(1)/2,Rs(2)/2,Rs(3)/2,'R_S');
text(Rs(1)+R(1)/2,Rs(2)+R(2)/2,Rs(3)+R(3)/2,'R');
xlabel('x (AU)');
ylabel('y (AU)');
zlabel('z (AU)');