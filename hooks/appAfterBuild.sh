ORIGINAL_PATH=`pwd`

if [ -f "$ORIGINAL_PATH/platforms/android/res/xml/config_temp.xml" ]; then
	rm -rf "$ORIGINAL_PATH/platforms/android/res/xml/config.xml"
	cp "$ORIGINAL_PATH/platforms/android/res/xml/config_temp.xml" "$ORIGINAL_PATH/platforms/android/res/xml/config.xml"
	rm -rf "$ORIGINAL_PATH/platforms/android/res/xml/config_temp.xml"
fi