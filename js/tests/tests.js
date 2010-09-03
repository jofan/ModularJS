App.test = {
	runJSpec: function(path, fixturePath, hidePassed) {
		var pathToFixture = fixturePath || '/spec/fixtures',
	      onlyFailures = hidePassed || false;
		JSpec
			.exec(path)
			.run({ failuresOnly: onlyFailures, fixturePath: pathToFixture })
			.report();
	}
};