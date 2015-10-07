# minify JS but ignore -min.js
JS_FILES = $(filter-out %-min.js,$(wildcard \
	dist/*.js \
))

# execute YUICompressor
# be sure to download yuicompressor-2.4.8.jar and put it in your ~/bin/ directory
YUI_COMPRESSOR = java -jar ~/bin/yuicompressor-2.4.8.jar

# flags for YUICompressor
YUI_COMPRESSOR_FLAGS = --charset utf-8 --verbose

JS_MINIFIED = $(JS_FILES:.js=-min.js)

# target: minify
minify: $(JS_FILES) $(JS_MINIFIED)

%-min.js: %.js
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type js $< >$@
	@echo

# target: clean
clean:
	rm -f $(JS_MINIFIED)