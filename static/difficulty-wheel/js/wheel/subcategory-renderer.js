const SubcategoryRenderer = {
    render(svg, categories, sectionAngle, center, innerRadius, outerRadius) {
        Object.entries(categories).forEach(([category, { color, subcategories }], index) => {
            const startAngle = index * sectionAngle - Math.PI / 2;
            const subAngle = sectionAngle / Object.keys(subcategories).length;

            Object.keys(subcategories).forEach((sub, subIndex) => {
                this.renderSection(svg, category, sub, color, startAngle + subAngle * subIndex, subAngle, center, innerRadius, outerRadius);
            });
        });
    },

    renderSection(svg, category, sub, color, startAngle, subAngle, center, innerRadius, outerRadius) {
        const endAngle = startAngle + subAngle;

        const subSection = WheelSVG.createSVGElement('path', {
            d: `M ${center + innerRadius * Math.cos(startAngle)} ${center + innerRadius * Math.sin(startAngle)}
                L ${center + outerRadius * Math.cos(startAngle)} ${center + outerRadius * Math.sin(startAngle)}
                A ${outerRadius} ${outerRadius} 0 0 1 ${center + outerRadius * Math.cos(endAngle)} ${center + outerRadius * Math.sin(endAngle)}
                L ${center + innerRadius * Math.cos(endAngle)} ${center + innerRadius * Math.sin(endAngle)}
                A ${innerRadius} ${innerRadius} 0 0 0 ${center + innerRadius * Math.cos(startAngle)} ${center + innerRadius * Math.sin(startAngle)}`,
            fill: color,
            'fill-opacity': State.difficulties[`${category}-${sub}`] / 10,
            stroke: 'white',
            'stroke-width': '1'
        });
        svg.appendChild(subSection);

        this.renderLabel(svg, sub, startAngle, subAngle, center, innerRadius, outerRadius);
    },

    renderLabel(svg, sub, startAngle, subAngle, center, innerRadius, outerRadius) {
        // Calculate dynamic font size
        const segmentHeight = outerRadius - innerRadius;
        const segmentWidth = 2 * Math.PI * ((innerRadius + outerRadius) / 2) * (subAngle / (2 * Math.PI));
        const fontSize = Math.min(segmentHeight * 0.15, segmentWidth * 0.2);

        const textAngle = startAngle + subAngle / 2;
        const textRadiusAdjustment = Math.min(sub.length * 0.5, 15);
        const midRadius = (innerRadius + outerRadius) / 2 - textRadiusAdjustment;
        const textX = center + midRadius * Math.cos(textAngle);
        const textY = center + midRadius * Math.sin(textAngle);

        const subLabel = WheelSVG.createSVGElement('text', {
            x: textX,
            y: textY,
            'text-anchor': 'middle',
            'font-size': `${fontSize}px`,
            fill: 'white',
            filter: 'url(#textShadow)',
            transform: `rotate(${Utils.getTextRotation(textAngle)}, ${textX}, ${textY})`
        });

        const wrappedText = Utils.wrapText(sub);
        wrappedText.forEach((line, lineIndex) => {
            const tspan = WheelSVG.createSVGElement('tspan', {
                x: textX,
                dy: lineIndex === 0 ? '0' : '1.2em',
                'text-anchor': 'middle'
            });
            tspan.textContent = line;
            subLabel.appendChild(tspan);
        });
        svg.appendChild(subLabel);
    }
};
