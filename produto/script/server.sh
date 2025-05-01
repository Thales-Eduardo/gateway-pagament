 test -d build && rm -rf build && yarn tsc && \
    node build/src/index.js || \
    yarn tsc && node build/index.js
