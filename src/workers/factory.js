/**
 * 创建Web worker
 *
 * @author: 邱巍
 * @since: 2017年06月28日
 * @functional
 */
var WF = (function(global, undefined) {
    return function(workerName, context, callback) {
        if ('Worker' in global) {
            var instance = new Worker(workerName + '.js');

            instance.postMessage(context);
            instance.addEventListener('message', callback);

            return instance;
        }

        throw new Error('Not supports Web Worker, upgrade your broswers');
    }
})(window, void 0)
