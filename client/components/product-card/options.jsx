/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import FormLabel from 'components/forms/form-label';
import FormRadio from 'components/forms/form-radio';
import ProductCardPriceGroup from './price-group';

const ProductCardOptions = ( {
	billingTimeFrame,
	currencyCode,
	handleSelect,
	options,
	optionsLabel,
	selectedSlug,
} ) => {
	if ( ! options ) {
		return null;
	}

	return (
		<div className="product-card__options">
			{ optionsLabel && <h4 className="product-card__options-label">{ optionsLabel }</h4> }
			{ options.map( option => (
				<FormLabel key={ `product-option-${ option.slug }` } className="product-card__option">
					<FormRadio
						checked={ option.slug === selectedSlug }
						onChange={ () => handleSelect( option.slug ) }
					/>
					<div className="product-card__option-description">
						<div className="product-card__option-name">{ option.title }</div>
						<ProductCardPriceGroup
							billingTimeFrame={ billingTimeFrame }
							currencyCode={ currencyCode }
							discountedPrice={ option.discountedPrice }
							fullPrice={ option.fullPrice }
						/>
					</div>
				</FormLabel>
			) ) }
		</div>
	);
};

ProductCardOptions.propTypes = {
	billingTimeFrame: PropTypes.string,
	currencyCode: PropTypes.string,
	handleSelect: PropTypes.func,
	options: PropTypes.arrayOf(
		PropTypes.shape( {
			discountedPrice: PropTypes.oneOfType( [
				PropTypes.number,
				PropTypes.arrayOf( PropTypes.number ),
			] ),
			fullPrice: PropTypes.oneOfType( [ PropTypes.number, PropTypes.arrayOf( PropTypes.number ) ] ),
			slug: PropTypes.string.isRequired,
			title: PropTypes.string,
		} )
	),
	optionsLabel: PropTypes.string,
	selectedSlug: PropTypes.string,
};

export default ProductCardOptions;
