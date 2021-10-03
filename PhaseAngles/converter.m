% Just converts Right Ascension and Declination values from their usual
% units into decimal degrees
clear
clc

ra_hms = [12 32 03.55];     % in hours minutes seconds (time)
dec_dms = [-03 27 30.4];    % in degrees minutes seconds (arc)

ra_calc = ra_hms(1)*15 + ra_hms(2)/4 + ra_hms(3)/240;
if dec_dms(1) < 0
    dec_calc = dec_dms(1) - dec_dms(2)/60 - dec_dms(3)/3600;
else
    dec_calc = dec_dms(1) + dec_dms(2)/60 + dec_dms(3)/3600;
end

ra_dec = 188.01478;
dec_dec = -3.45845;