declare const __brand: unique symbol;
declare const __extends: unique symbol;

export type Brand<T, B extends string> = T & {
	readonly [__brand]?: B;
};

type Extends<B> = {
	readonly [__extends]?: B;
};

type BrandBase<T> = T extends Brand<infer A, string> ? A : never;

export type ExtendedBrand<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Brand<any, string>,
	B extends string
> = T & Extends<Brand<BrandBase<T>, B>>;

export type BrandedId<B extends string> = Brand<string, B>;

export type ExtendedBrandedID<
	T extends BrandedId<string>,
	B extends string,
> = ExtendedBrand<T, B>;

export type Guid = BrandedId<"guid">;