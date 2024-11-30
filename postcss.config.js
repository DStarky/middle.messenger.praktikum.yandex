import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postCssNested from 'postcss-nested';

export default {
	plugins: [
		postcssPresetEnv(),
		autoprefixer(),
		postCssNested(),
		cssnano({
			preset: 'default',
		}),
	],
};
